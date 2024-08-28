import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserOauth } from '../entities/user-oauth.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserOauth)
    private userOauthRepository: Repository<UserOauth>,
  ) {}

  async findOrCreateByOAuthId(
    provider: string,
    oauthId: string,
    userData: any,
  ): Promise<User> {
    let userOauth = await this.userOauthRepository.findOne({
      where: { oauthProvider: provider, oauthId: oauthId },
      relations: ['user'],
    });

    if (!userOauth) {
      const newUser = this.userRepository.create({
        nickname: userData.nickname,
        email: userData.email,
        profilePictureUrl: userData.profile_picture_url,
      });
      await this.userRepository.save(newUser);

      userOauth = this.userOauthRepository.create({
        oauthProvider: provider,
        oauthId: oauthId,
        user: newUser,
      });
      await this.userOauthRepository.save(userOauth);
    }

    return userOauth.user;
  }

  async setCurrentRefreshToken(
    userId: number,
    hashedRefreshToken: string,
  ): Promise<void> {
    const userOauth = await this.userOauthRepository.findOne({
      where: { user: { userId: userId } },
    });
    if (userOauth) {
      userOauth.refreshToken = hashedRefreshToken;
      await this.userOauthRepository.save(userOauth);
    }
  }

  async getUserWithCurrentRefreshToken(userId: number): Promise<User | null> {
    const userOauth = await this.userOauthRepository.findOne({
      where: { user: { userId: userId } },
      relations: ['user'],
    });
    return userOauth ? userOauth.user : null;
  }

  async removeRefreshToken(userId: number): Promise<void> {
    await this.userOauthRepository.update(
      { user: { userId: userId } },
      { refreshToken: null },
    );
  }

  async findOne(options: any): Promise<User | undefined> {
    return this.userRepository.findOne(options);
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { userId: userId } });
  }

  async updateUser(
    userId: number,
    updateData: Partial<User>,
  ): Promise<User | null> {
    await this.userRepository.update(userId, updateData);
    return this.userRepository.findOne({ where: { userId: userId } });
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      lastLogin: new Date(),
    });
  }
}
