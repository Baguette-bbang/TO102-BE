import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Post } from '../../entities/post.entity';

export class CreatePostDto extends PickType(Post, [
  'title',
  'content',
  'thumbnail',
  'userId',
  'locationId',
  'meetingDate',
] as const) {
  @ApiProperty({
    description: '태그 ID 목록',
    example: [1, 2, 3],
    required: false,
  })
  tagIds?: number[];
}

export class UpdatePostDto extends PartialType(
  PickType(Post, [
    'title',
    'content',
    'thumbnail',
    'locationId',
    'meetingDate',
  ] as const),
) {
  @ApiProperty({
    description: '태그 ID 목록',
    example: [1, 2, 3],
    required: false,
  })
  tagIds?: number[];
}

export class PostResponseDto extends PickType(Post, [
  'postId',
  'title',
  'content',
  'thumbnail',
  'userId',
  'locationId',
  'meetingDate',
  'createdAt',
  'updatedAt',
  'status',
] as const) {
  @ApiProperty({
    description: '태그 정보 목록',
    example: [
      { id: 1, name: 'NestJS' },
      { id: 2, name: 'TypeScript' },
    ],
    required: false,
  })
  tags: { id: number; name: string }[];
}
