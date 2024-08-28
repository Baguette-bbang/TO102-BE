import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ description: '태그 이름', example: 'JavaScript' })
  name: string;
}

export class UpdateTagDto {
  @ApiProperty({
    description: '태그 이름',
    example: 'TypeScript',
    required: false,
  })
  name?: string;
}

export class TagResponseDto {
  @ApiProperty({ description: '태그 ID', example: 1 })
  tagId: number;

  @ApiProperty({ description: '태그 이름', example: 'JavaScript' })
  name: string;
}
