import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { UserRating } from '../entities/user-rating.entity';
import { User } from '../entities/user.entity';
import { CreateReviewDto, ReviewResponseDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(UserRating)
    private readonly userRatingRepository: Repository<UserRating>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 리뷰 생성
  async createReview(
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const { reviewerId, reviewedId, rating, content } = createReviewDto;

    if (reviewerId === reviewedId) {
      throw new BadRequestException('자신에게 리뷰를 작성할 수 없습니다.');
    }

    const reviewer = await this.userRepository.findOne({
      where: { userId: reviewerId },
    });
    const reviewed = await this.userRepository.findOne({
      where: { userId: reviewedId },
    });

    if (!reviewer || !reviewed) {
      throw new NotFoundException(
        '리뷰 작성자 또는 대상 사용자를 찾을 수 없습니다.',
      );
    }

    const review = this.reviewRepository.create({
      reviewerId,
      reviewedId,
      rating,
      content,
      reviewer,
      reviewed,
    });

    const savedReview = await this.reviewRepository.save(review);

    // 사용자 평점 업데이트
    await this.updateUserRating(reviewedId);

    return this.mapReviewToResponseDto(savedReview);
  }

  // 특정 사용자가 받은 모든 리뷰 조회
  async getReviewsForUser(userId: number): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewRepository.find({
      where: { reviewedId: userId },
      relations: ['reviewer', 'reviewed'],
    });

    if (reviews.length === 0) {
      throw new NotFoundException(
        '해당 사용자가 받은 리뷰를 찾을 수 없습니다.',
      );
    }

    return reviews.map((review) => this.mapReviewToResponseDto(review));
  }

  // 사용자 평점 업데이트
  private async updateUserRating(userId: number): Promise<void> {
    const reviews = await this.reviewRepository.find({
      where: { reviewedId: userId },
    });

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    let userRating = await this.userRatingRepository.findOne({
      where: { userId },
    });
    if (!userRating) {
      userRating = this.userRatingRepository.create({ userId, averageRating });
    } else {
      userRating.averageRating = averageRating;
    }

    await this.userRatingRepository.save(userRating);
  }

  // 리뷰 응답 DTO로 매핑
  private mapReviewToResponseDto(review: Review): ReviewResponseDto {
    return {
      reviewId: review.reviewId,
      reviewerId: review.reviewerId,
      reviewedId: review.reviewedId,
      rating: review.rating,
      content: review.content,
      createdAt: review.createdAt,
    };
  }
}
