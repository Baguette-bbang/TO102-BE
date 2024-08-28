import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { CreateTagDto, UpdateTagDto, TagResponseDto } from './dto/tag.dto';

@ApiTags('태그')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({
    summary: '태그 생성',
    description: '새로운 태그를 생성합니다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '태그가 성공적으로 생성되었습니다.',
    type: TagResponseDto,
  })
  createTag(@Body() createTagDto: CreateTagDto): Promise<TagResponseDto> {
    return this.tagService.createTag(createTagDto);
  }

  @Get()
  @ApiOperation({
    summary: '모든 태그 조회',
    description: '모든 태그 목록을 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '태그 목록 조회 성공',
    type: [TagResponseDto],
  })
  getAllTags(): Promise<TagResponseDto[]> {
    return this.tagService.getAllTags();
  }

  @Get(':id')
  @ApiOperation({
    summary: '태그 조회',
    description: 'ID로 태그를 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '태그 조회 성공',
    type: TagResponseDto,
  })
  getTagById(@Param('id') tagId: number): Promise<TagResponseDto> {
    return this.tagService.getTagById(tagId);
  }

  @Put(':id')
  @ApiOperation({
    summary: '태그 수정',
    description: '기존 태그를 수정합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '태그 수정 성공',
    type: TagResponseDto,
  })
  updateTag(
    @Param('id') tagId: number,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<TagResponseDto> {
    return this.tagService.updateTag(tagId, updateTagDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '태그 삭제',
    description: 'ID로 태그를 삭제합니다.',
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: '태그 삭제 성공' })
  deleteTag(@Param('id') tagId: number): Promise<void> {
    return this.tagService.deleteTag(tagId);
  }
}
