import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: '게시글 제목', example: 'NestJS 게시글 예제' })
  title: string;

  @ApiProperty({
    description: '게시글 내용',
    example: '이것은 예제 게시글입니다.',
  })
  content: string;

  @ApiProperty({
    description: '썸네일 URL',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  thumbnail?: string;

  @ApiProperty({ description: '사용자 ID', example: 1 })
  userId: number;

  @ApiProperty({ description: '위치 ID', example: 1 })
  locationId: number;

  @ApiProperty({
    description: '모임 날짜',
    example: '2024-09-01T14:00:00.000Z',
  })
  meetingDate: Date;

  @ApiProperty({
    description: '태그 목록',
    example: ['NestJS', 'TypeScript'],
    required: false,
  })
  tags?: string[];
}

export class UpdatePostDto {
  @ApiProperty({
    description: '게시글 제목',
    example: 'NestJS 게시글 예제',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: '게시글 내용',
    example: '이것은 예제 게시글입니다.',
    required: false,
  })
  content?: string;

  @ApiProperty({
    description: '썸네일 URL',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  thumbnail?: string;

  @ApiProperty({ description: '위치 ID', example: 1, required: false })
  locationId?: number;

  @ApiProperty({
    description: '모임 날짜',
    example: '2024-09-01T14:00:00.000Z',
    required: false,
  })
  meetingDate?: Date;

  @ApiProperty({
    description: '태그 목록',
    example: ['NestJS', 'TypeScript'],
    required: false,
  })
  tags?: string[];
}

export class PostResponseDto {
  @ApiProperty({ description: '게시글 ID', example: 1 })
  postId: number;

  @ApiProperty({ description: '게시글 제목', example: 'NestJS 게시글 예제' })
  title: string;

  @ApiProperty({
    description: '게시글 내용',
    example: '이것은 예제 게시글입니다.',
  })
  content: string;

  @ApiProperty({
    description: '썸네일 URL',
    example: 'https://example.com/thumbnail.jpg',
  })
  thumbnail?: string;

  @ApiProperty({ description: '사용자 ID', example: 1 })
  userId: number;

  @ApiProperty({ description: '위치 ID', example: 1 })
  locationId: number;

  @ApiProperty({
    description: '모임 날짜',
    example: '2024-09-01T14:00:00.000Z',
  })
  meetingDate: Date;

  @ApiProperty({
    description: '생성 날짜',
    example: '2024-08-28T14:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 날짜',
    example: '2024-08-29T14:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({ description: '게시글 상태', example: 'active' })
  status: string;

  @ApiProperty({
    description: '태그 목록',
    example: ['NestJS', 'TypeScript'],
    required: false,
  })
  tags: string[];
}
