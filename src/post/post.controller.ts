import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto, PostResponseDto } from './dto/post.dto';

@ApiTags('게시글')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({
    summary: '게시글 생성',
    description: '새로운 게시글을 생성합니다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '게시글이 성공적으로 생성되었습니다.',
    type: PostResponseDto,
  })
  createPost(@Body() createPostDto: CreatePostDto): Promise<PostResponseDto> {
    return this.postService.createPost(createPostDto);
  }

  @Get()
  @ApiOperation({
    summary: '모든 게시글 조회',
    description: '모든 게시글을 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '모든 게시글 조회 성공',
    type: [PostResponseDto],
  })
  getAllPosts(): Promise<PostResponseDto[]> {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  @ApiOperation({
    summary: '게시글 조회',
    description: 'ID로 특정 게시글을 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글 조회 성공',
    type: PostResponseDto,
  })
  getPostById(@Param('id') postId: number): Promise<PostResponseDto> {
    return this.postService.getPostById(postId);
  }

  @Put(':postId')
  @ApiOperation({
    summary: '게시글 수정',
    description: '특정 ID의 게시글을 수정합니다.',
  })
  @ApiParam({
    name: 'postId',
    description: '수정할 게시글의 ID',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '게시글 수정 성공',
    type: PostResponseDto,
  })
  updatePost(
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.updatePost(postId, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '게시글 삭제',
    description: 'ID로 특정 게시글을 삭제합니다.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '게시글 삭제 성공',
  })
  deletePost(@Param('id') postId: number): Promise<void> {
    return this.postService.deletePost(postId);
  }

  @Get('tag/:tagId')
  @ApiOperation({
    summary: '특정 태그로 게시글 조회',
    description: '특정 태그 ID에 해당하는 게시글을 조회합니다.',
  })
  @ApiParam({
    name: 'tagId',
    description: '조회할 태그의 ID',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '태그로 필터링된 게시글 조회 성공',
    type: [PostResponseDto],
  })
  getPostsByTag(@Param('tagId') tagId: number): Promise<PostResponseDto[]> {
    return this.postService.getPostsByTag(tagId);
  }

  @Get('location/:locationId')
  @ApiOperation({
    summary: '특정 지역으로 게시글 조회',
    description: '특정 지역에 해당하는 게시글을 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '지역으로 필터링된 게시글 조회 성공',
    type: [PostResponseDto],
  })
  getPostsByLocation(
    @Param('locationId') locationId: number,
  ): Promise<PostResponseDto[]> {
    return this.postService.getPostsByLocation(locationId);
  }

  @Get('latest')
  @ApiOperation({
    summary: '최신 게시글 10개 조회',
    description: '가장 최근에 작성된 게시글 10개를 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '최신 게시글 조회 성공',
    type: [PostResponseDto],
  })
  getLatestPosts(): Promise<PostResponseDto[]> {
    return this.postService.getLatestPosts();
  }
}
