import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostTag } from '../entities/post-tag.entity';
import { Tag } from '../entities/tag.entity';
import { CreatePostDto, UpdatePostDto, PostResponseDto } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostTag)
    private readonly postTagRepository: Repository<PostTag>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  // 게시글 생성
  async createPost(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const { title, content, thumbnail, userId, locationId, tags, meetingDate } =
      createPostDto;

    const post = this.postRepository.create({
      title,
      content,
      thumbnail,
      userId,
      locationId,
      meetingDate,
      status: 'active', // 기본 상태값을 'active'로 설정
    });

    const savedPost = await this.postRepository.save(post);

    // 태그 추가
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        let tag = await this.tagRepository.findOne({
          where: { name: tagName },
        });
        if (!tag) {
          tag = this.tagRepository.create({ name: tagName });
          await this.tagRepository.save(tag);
        }

        const postTag = this.postTagRepository.create({
          postId: savedPost.postId,
          tagId: tag.tagId,
        });

        await this.postTagRepository.save(postTag);
      }
    }

    return this.mapPostToResponseDto(savedPost);
  }

  // 모든 게시글 조회
  async getAllPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      relations: ['user', 'location', 'postTags', 'postTags.tag'],
    });
    return posts.map((post) => this.mapPostToResponseDto(post));
  }

  // 게시글 ID로 조회 (DTO 반환)
  async getPostById(postId: number): Promise<PostResponseDto> {
    const post = await this.getPostEntityById(postId);
    return this.mapPostToResponseDto(post);
  }

  // 게시글 ID로 조회 (엔티티 반환)
  private async getPostEntityById(postId: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { postId },
      relations: ['user', 'location', 'postTags', 'postTags.tag'],
    });

    if (!post) {
      throw new NotFoundException(
        `ID가 ${postId}인 게시글을 찾을 수 없습니다.`,
      );
    }

    return post;
  }

  // 게시글 수정
  async updatePost(
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const post = await this.getPostEntityById(postId);
    Object.assign(post, updatePostDto);

    const updatedPost = await this.postRepository.save(post);

    // 태그 업데이트
    if (updatePostDto.tags && updatePostDto.tags.length > 0) {
      await this.postTagRepository.delete({ postId: post.postId });

      for (const tagName of updatePostDto.tags) {
        let tag = await this.tagRepository.findOne({
          where: { name: tagName },
        });
        if (!tag) {
          tag = this.tagRepository.create({ name: tagName });
          await this.tagRepository.save(tag);
        }

        const postTag = this.postTagRepository.create({
          postId: updatedPost.postId,
          tagId: tag.tagId,
        });

        await this.postTagRepository.save(postTag);
      }
    }

    return this.mapPostToResponseDto(updatedPost);
  }

  // 게시글 삭제
  async deletePost(postId: number): Promise<void> {
    const post = await this.getPostEntityById(postId);

    await this.postTagRepository.delete({ postId: post.postId });
    await this.postRepository.remove(post);
  }
  async getPostsByTag(tagName: string): Promise<PostResponseDto[]> {
    const tag = await this.tagRepository.findOne({ where: { name: tagName } });

    if (!tag) {
      throw new NotFoundException(`태그 "${tagName}"를 찾을 수 없습니다.`);
    }

    const posts = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.postTags', 'postTag')
      .innerJoin('postTag.tag', 'tag')
      .where('tag.name = :tagName', { tagName })
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.location', 'location')
      .leftJoinAndSelect('post.postTags', 'postTags')
      .leftJoinAndSelect('postTags.tag', 'tags')
      .getMany();

    return posts.map((post) => this.mapPostToResponseDto(post));
  }

  // 특정 지역으로 게시글 조회
  async getPostsByLocation(locationId: number): Promise<PostResponseDto[]> {
    const location = await this.postRepository.find({
      where: { locationId },
      relations: ['user', 'location', 'postTags', 'postTags.tag'],
    });

    if (!location || location.length === 0) {
      throw new NotFoundException(
        `ID가 ${locationId}인 지역에 해당하는 게시글을 찾을 수 없습니다.`,
      );
    }

    return location.map((post) => this.mapPostToResponseDto(post));
  }

  // 게시글 응답 DTO로 매핑
  private mapPostToResponseDto(post: Post): PostResponseDto {
    return {
      postId: post.postId,
      title: post.title,
      content: post.content,
      thumbnail: post.thumbnail,
      userId: post.userId,
      locationId: post.locationId,
      meetingDate: post.meetingDate,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      status: post.status,
      tags: post.postTags ? post.postTags.map((pt) => pt.tag.name) : [],
    };
  }

  async getLatestPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
      relations: ['user', 'location', 'postTags', 'postTags.tag'],
    });

    return posts.map((post) => this.mapPostToResponseDto(post));
  }
}
