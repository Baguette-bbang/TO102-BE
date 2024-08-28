import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: '리뷰 작성자 ID', example: 1 })
  reviewerId: number;

  @ApiProperty({ description: '리뷰 대상자 ID', example: 2 })
  reviewedId: number;

  @ApiProperty({ description: '평점', example: 4.5 })
  rating: number;

  @ApiProperty({ description: '리뷰 내용', example: '훌륭한 사용자입니다.' })
  content: string;
}

export class ReviewResponseDto {
  @ApiProperty({ description: '리뷰 ID', example: 1 })
  reviewId: number;

  @ApiProperty({ description: '리뷰 작성자 ID', example: 1 })
  reviewerId: number;

  @ApiProperty({ description: '리뷰 대상자 ID', example: 2 })
  reviewedId: number;

  @ApiProperty({ description: '평점', example: 4.5 })
  rating: number;

  @ApiProperty({ description: '리뷰 내용', example: '훌륭한 사용자입니다.' })
  content: string;

  @ApiProperty({
    description: '리뷰 작성일',
    example: '2024-08-28T12:00:00.000Z',
  })
  createdAt: Date;
}
