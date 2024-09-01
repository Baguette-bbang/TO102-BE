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
      tags:
        post.postTags?.map((postTag) => ({
          id: postTag.tag.tagId,
          name: postTag.tag.name,
        })) || [],
    };
  }
  // 게시글 생성
  async createPost(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const {
      title,
      content,
      thumbnail,
      userId,
      locationId,
      tagIds,
      meetingDate,
    } = createPostDto;

    const post = this.postRepository.create({
      title,
      content,
      thumbnail,
      userId,
      locationId,
      meetingDate,
      status: 'active',
    });

    const savedPost = await this.postRepository.save(post);

    // 태그 추가
    if (tagIds && tagIds.length > 0) {
      for (const tagId of tagIds) {
        const tag = await this.tagRepository.findOne({ where: { tagId } });
        if (tag) {
          const postTag = this.postTagRepository.create({
            post: savedPost,
            tag: tag,
          });
          await this.postTagRepository.save(postTag);
        }
      }
    }

    // 저장 후 다시 로드하여 관계를 포함한 상태로 반환
    const postWithTags = await this.getPostEntityById(savedPost.postId);
    return this.mapPostToResponseDto(postWithTags);
  }

  // 모든 게시글 조회
  async getAllPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      relations: ['postTags', 'postTags.tag'],
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
      relations: ['postTags', 'postTags.tag'],
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
    if (updatePostDto.tagIds) {
      await this.postTagRepository.delete({ postId: post.postId });

      for (const tagId of updatePostDto.tagIds) {
        const tag = await this.tagRepository.findOne({ where: { tagId } });
        if (tag) {
          const postTag = this.postTagRepository.create({
            post: updatedPost,
            tag: tag,
          });
          await this.postTagRepository.save(postTag);
        }
      }
    }

    // 수정 후 다시 로드하여 관계를 포함한 상태로 반환
    const postWithTags = await this.getPostEntityById(updatedPost.postId);
    return this.mapPostToResponseDto(postWithTags);
  }

  // 게시글 삭제
  async deletePost(postId: number): Promise<void> {
    const post = await this.getPostEntityById(postId);

    await this.postTagRepository.delete({ postId: post.postId });
    await this.postRepository.remove(post);
  }

  // 태그로 게시글 조회
  async getPostsByTag(tagId: number): Promise<PostResponseDto[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.postTags', 'postTag')
      .innerJoin('postTag.tag', 'tag')
      .where('tag.tagId = :tagId', { tagId })
      .leftJoinAndSelect('post.postTags', 'postTags')
      .leftJoinAndSelect('postTags.tag', 'tags')
      .getMany();

    return posts.map((post) => this.mapPostToResponseDto(post));
  }

  // 특정 지역으로 게시글 조회
  async getPostsByLocation(locationId: number): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      where: { locationId },
      relations: ['postTags', 'postTags.tag'],
    });

    if (!posts || posts.length === 0) {
      throw new NotFoundException(
        `ID가 ${locationId}인 지역에 해당하는 게시글을 찾을 수 없습니다.`,
      );
    }

    return posts.map((post) => this.mapPostToResponseDto(post));
  }

  // 최신 게시글 10개 조회
  async getLatestPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
      relations: ['postTags', 'postTags.tag'],
    });

    return posts.map((post) => this.mapPostToResponseDto(post));
  }
}
