import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship } from '../entities/friendship.entity';
import { FriendRequest } from '../entities/friend-request.entity';
import { UserBlock } from '../entities/user-block.entity';
import { User } from '../entities/user.entity';
import { CreateFriendRequestDto, BlockUserDto } from './dto/friendship.dto';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(UserBlock)
    private readonly userBlockRepository: Repository<UserBlock>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 친구 요청 보내기
  async sendFriendRequest(
    createFriendRequestDto: CreateFriendRequestDto,
  ): Promise<void> {
    const { requesterId, addresseeId } = createFriendRequestDto;

    // 차단 관계 확인
    const isBlocked = await this.userBlockRepository.findOne({
      where: [
        { blockerId: requesterId, blockedId: addresseeId },
        { blockerId: addresseeId, blockedId: requesterId },
      ],
    });

    if (isBlocked) {
      throw new BadRequestException(
        '차단 관계에서는 친구 요청을 보낼 수 없습니다.',
      );
    }

    // 이미 친구 요청이 있는지 확인
    const existingRequest = await this.friendRequestRepository.findOne({
      where: [
        { requesterId, addresseeId },
        { requesterId: addresseeId, addresseeId: requesterId },
      ],
    });

    if (existingRequest) {
      throw new ConflictException('이미 친구 요청이 존재합니다.');
    }

    // 친구 관계 확인
    const existingFriendship = await this.friendshipRepository.findOne({
      where: [
        { userId1: requesterId, userId2: addresseeId },
        { userId1: addresseeId, userId2: requesterId },
      ],
    });

    if (existingFriendship) {
      throw new ConflictException('이미 친구 관계가 존재합니다.');
    }

    // 친구 요청 생성
    const friendRequest = this.friendRequestRepository.create({
      requesterId,
      addresseeId,
    });
    await this.friendRequestRepository.save(friendRequest);
  }

  // 친구 요청 수락
  async acceptFriendRequest(
    requesterId: number,
    addresseeId: number,
  ): Promise<void> {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { requesterId, addresseeId },
    });

    if (!friendRequest) {
      throw new NotFoundException('친구 요청을 찾을 수 없습니다.');
    }

    await this.friendRequestRepository.remove(friendRequest);

    const friendship = this.friendshipRepository.create({
      userId1: requesterId,
      userId2: addresseeId,
    });
    await this.friendshipRepository.save(friendship);
  }

  // 친구 요청 거절 또는 요청 취소
  async declineFriendRequest(
    requesterId: number,
    addresseeId: number,
  ): Promise<void> {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { requesterId, addresseeId },
    });

    if (!friendRequest) {
      throw new NotFoundException('친구 요청을 찾을 수 없습니다.');
    }

    await this.friendRequestRepository.remove(friendRequest);
  }

  // 친구 관계 삭제
  async deleteFriendship(userId1: number, userId2: number): Promise<void> {
    const friendship = await this.friendshipRepository.findOne({
      where: [
        { userId1, userId2 },
        { userId1: userId2, userId2: userId1 },
      ],
    });

    if (!friendship) {
      throw new NotFoundException('해당 친구 관계를 찾을 수 없습니다.');
    }

    await this.friendshipRepository.remove(friendship);
  }

  // 사용자 차단
  async blockUser(blockUserDto: BlockUserDto): Promise<void> {
    const { blockerId, blockedId } = blockUserDto;

    const existingBlock = await this.userBlockRepository.findOne({
      where: { blockerId, blockedId },
    });

    if (existingBlock) {
      throw new ConflictException('이미 차단된 사용자입니다.');
    }

    const userBlock = this.userBlockRepository.create({
      blockerId,
      blockedId,
    });
    await this.userBlockRepository.save(userBlock);
  }
}
