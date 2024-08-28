import { Controller, Post, Get, Param, Body, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto, ReviewResponseDto } from './dto/review.dto';

@ApiTags('리뷰')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({
    summary: '리뷰 작성',
    description: '새로운 리뷰를 작성합니다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '리뷰 작성 성공',
    type: ReviewResponseDto,
  })
  createReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewService.createReview(createReviewDto);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: '사용자가 받은 리뷰 조회',
    description: '특정 사용자가 받은 모든 리뷰를 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '리뷰 조회 성공',
    type: [ReviewResponseDto],
  })
  getReviewsForUser(
    @Param('userId') userId: number,
  ): Promise<ReviewResponseDto[]> {
    return this.reviewService.getReviewsForUser(userId);
  }
}
