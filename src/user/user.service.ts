import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserOauth } from '../entities/user-oauth.entity';
import {
  UserRatingResponseDto,
  UserResponseDto,
  UsernameUpdateDto,
} from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserRating } from 'src/entities/user-rating.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserOauth)
    private userOauthRepository: Repository<UserOauth>,
    private configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @InjectRepository(UserRating)
    private readonly userRatingRepository: Repository<UserRating>,
  ) {}

  async getUserById(id: number): Promise<User> {
    this.logger.log(`사용자 정보 조회 요청. ID: ${id}`);
    if (!id || isNaN(id)) {
      throw new NotFoundException(`Invalid user ID: ${id}`);
    }
    const user = await this.userRepository.findOne({
      where: { userId: id },
      relations: ['oauths'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateUsername(
    id: number,
    usernameUpdateDto: UsernameUpdateDto,
  ): Promise<UserResponseDto> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // 중복 검사
    const existingUser = await this.userRepository.findOne({
      where: { username: usernameUpdateDto.username },
    });
    if (existingUser && existingUser.userId !== id) {
      throw new HttpException(
        '이미 존재하는 사용자 이름입니다.',
        HttpStatus.CONFLICT,
      );
    }

    user.username = usernameUpdateDto.username;
    const updatedUser = await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { oauths, ...userResponse } = updatedUser;
    return userResponse;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.getUserById(id);
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async getCurrentUserInfo(accessToken: string): Promise<User> {
    try {
      const kakaoUserInfo =
        await this.authService.getKakaoUserInfo(accessToken);

      const userOauth = await this.userOauthRepository.findOne({
        where: { oauthProvider: 'kakao', oauthId: kakaoUserInfo.id },
        relations: ['user'],
      });

      if (!userOauth || !userOauth.user) {
        this.logger.warn(
          `카카오 ID: ${kakaoUserInfo.id}에 해당하는 유저 정보를 찾을 수 없습니다.`,
        );
        throw new NotFoundException('유저 정보를 찾을 수 없습니다.');
      }

      return userOauth.user;
    } catch (error) {
      this.logger.error(
        `현재 유저 정보를 반환하는데 실패하였습니다.: ${error.message}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new UnauthorizedException('유저 정보를 반환하는데 실패하였습니다.');
    }
  }

  // 특정 사용자의 별점(평점) 조회
  async getUserRating(userId: number): Promise<UserRatingResponseDto> {
    const userRating = await this.userRatingRepository.findOne({
      where: { userId },
    });

    if (!userRating) {
      throw new NotFoundException(
        `ID가 ${userId}인 사용자의 별점을 찾을 수 없습니다.`,
      );
    }

    return {
      userId: userRating.userId,
      averageRating: userRating.averageRating,
    };
  }
}
