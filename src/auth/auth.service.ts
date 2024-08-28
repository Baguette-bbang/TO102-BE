import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserOauth } from '../entities/user-oauth.entity';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserOauth)
    private readonly userOauthRepository: Repository<UserOauth>,
  ) {}

  async validateUser(oauthProvider: string, oauthId: string): Promise<User> {
    let userOauth = await this.userOauthRepository.findOne({
      where: { oauthProvider, oauthId },
      relations: ['user'],
    });

    if (!userOauth) {
      // 새 사용자와 UserOauth 엔트리 생성
      const newUser = this.userRepository.create({
        nickname: '',
        email: '',
        profilePictureUrl: '',
      });
      await this.userRepository.save(newUser);

      userOauth = this.userOauthRepository.create({
        oauthProvider,
        oauthId,
        user: newUser,
      });
      await this.userOauthRepository.save(userOauth);

      this.logger.log(`새로운 사용자 생성: ${oauthId}`);
    }

    return userOauth.user;
  }

  async login(user: User) {
    const payload = {
      sub: user.userId,
      nickname: user.nickname,
    };
    this.logger.log(`로그인 payload 생성: ${JSON.stringify(payload)}`);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async updateUser(user: User): Promise<User> {
    this.logger.log(`사용자 업데이트: ${user.userId}`);
    return await this.userRepository.save(user);
  }

  async getKakaoToken(
    code: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const response = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        null,
        {
          params: {
            grant_type: 'authorization_code',
            client_id: this.configService.get('KAKAO_CLIENT_ID'),
            redirect_uri: this.configService.get('KAKAO_CALLBACK_URL'),
            code: code,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
      return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
      };
    } catch (error) {
      this.logger.error(
        '카카오 토큰 가져오기 실패:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async getKakaoUserInfo(accessToken: string): Promise<any> {
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { id, kakao_account, properties } = response.data;
    return {
      id: id.toString(),
      nickname: properties.nickname,
      email: kakao_account.email,
      profile_image: properties.profile_image,
    };
  }

  async processKakaoLogin(code: string) {
    const kakaoToken = await this.getKakaoToken(code);
    const userInfo = await this.getKakaoUserInfo(kakaoToken.access_token);
    this.logger.log('액세스 토큰:', kakaoToken.access_token);
    this.logger.log('카카오 유저 정보:', userInfo);

    let userOauth = await this.userOauthRepository.findOne({
      where: { oauthProvider: 'kakao', oauthId: userInfo.id },
      relations: ['user'],
    });

    if (!userOauth) {
      // 새 사용자와 UserOauth 엔트리 생성
      const newUser = this.userRepository.create({
        nickname: userInfo.nickname,
        email: userInfo.email,
        profilePictureUrl: userInfo.profile_image,
      });
      await this.userRepository.save(newUser);

      userOauth = this.userOauthRepository.create({
        oauthProvider: 'kakao',
        oauthId: userInfo.id,
        refreshToken: kakaoToken.refresh_token,
        user: newUser,
      });
      await this.userOauthRepository.save(userOauth);

      this.logger.log('새로운 유저 정보 DB에 저장:', newUser);
    } else {
      // 기존 사용자 정보 업데이트
      userOauth.user.nickname = userInfo.nickname;
      userOauth.user.email = userInfo.email;
      userOauth.user.profilePictureUrl = userInfo.profile_image;
      userOauth.refreshToken = kakaoToken.refresh_token;

      await this.userRepository.save(userOauth.user);
      await this.userOauthRepository.save(userOauth);

      this.logger.log('기존 유저 정보 업데이트:', userOauth.user);
    }

    return kakaoToken.access_token;
  }
}
