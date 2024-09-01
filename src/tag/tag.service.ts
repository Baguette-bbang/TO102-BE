import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { CreateTagDto, UpdateTagDto, TagResponseDto } from './dto/tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(createTagDto: CreateTagDto): Promise<TagResponseDto> {
    const tag = this.tagRepository.create(createTagDto);
    await this.tagRepository.save(tag);
    return tag;
  }

  async getAllTags(): Promise<TagResponseDto[]> {
    return await this.tagRepository.find();
  }

  async getTagById(tagId: number): Promise<TagResponseDto> {
    const tag = await this.tagRepository.findOne({ where: { tagId } });
    if (!tag) {
      throw new NotFoundException(`ID가 ${tagId}인 태그를 찾을 수 없습니다.`);
    }
    return tag;
  }

  async updateTag(
    tagId: number,
    updateTagDto: UpdateTagDto,
  ): Promise<TagResponseDto> {
    const tag = await this.getTagById(tagId);
    Object.assign(tag, updateTagDto);
    return await this.tagRepository.save(tag);
  }

  async deleteTag(tagId: number): Promise<void> {
    const result = await this.tagRepository.delete(tagId);
    if (result.affected === 0) {
      throw new NotFoundException(`ID가 ${tagId}인 태그를 찾을 수 없습니다.`);
    }
  }

  async getTagByName(tagName: string): Promise<TagResponseDto> {
    const tag = await this.tagRepository.findOne({ where: { name: tagName } });
    if (!tag) {
      throw new NotFoundException(`ID가 ${tagName}인 태그를 찾을 수 없습니다.`);
    }
    return tag;
  }
}
