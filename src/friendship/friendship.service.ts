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
import {
  CreateFriendRequestDto,
  BlockUserDto,
  ResponseFriendRequestDto,
  ResponseFriendshipDto,
} from './dto/friendship.dto';

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

  private async checkBlockRelationship(
    userId1: number,
    userId2: number,
  ): Promise<void> {
    const isBlocked = await this.userBlockRepository.findOne({
      where: [
        { blockerId: userId1, blockedId: userId2 },
        { blockerId: userId2, blockedId: userId1 },
      ],
    });

    if (isBlocked) {
      throw new BadRequestException(
        '차단 관계에서는 이 작업을 수행할 수 없습니다.',
      );
    }
  }

  // 친구 요청 보내기
  async sendFriendRequest(
    createFriendRequestDto: CreateFriendRequestDto,
  ): Promise<ResponseFriendRequestDto> {
    const { requesterId, addresseeId } = createFriendRequestDto;

    await this.checkBlockRelationship(requesterId, addresseeId);

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

    return { requestId: friendRequest.requestId };
  }

  // 친구 요청 수락
  async acceptFriendRequest(requestId: number): Promise<ResponseFriendshipDto> {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { requestId },
    });

    if (!friendRequest) {
      throw new NotFoundException('친구 요청을 찾을 수 없습니다.');
    }

    await this.checkBlockRelationship(
      friendRequest.requesterId,
      friendRequest.addresseeId,
    );

    await this.friendRequestRepository.remove(friendRequest);

    const friendship = this.friendshipRepository.create({
      userId1: friendRequest.requesterId,
      userId2: friendRequest.addresseeId,
    });
    await this.friendshipRepository.save(friendship);
    return { friendshipId: friendship.friendshipId };
  }

  // 특정 유저의 모든 친구를 조회
  async getAllFriends(userId: number): Promise<ResponseFriendshipDto[]> {
    const friendships = await this.friendshipRepository.find({
      where: [{ userId1: userId }, { userId2: userId }],
      relations: ['user1', 'user2'],
    });

    return friendships.map((friendship) => {
      // 간단히 로직을 수정하여 문제 발생 여부를 확인
      const friendId =
        friendship.userId1 === Number(userId)
          ? friendship.userId2
          : friendship.userId1;
      return {
        friendshipId: friendship.friendshipId,
        friendId: friendId,
      };
    });
  }

  // 친구 요청 거절 또는 요청 취소
  async declineFriendRequest(requestId: number): Promise<void> {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { requestId },
    });

    if (!friendRequest) {
      throw new NotFoundException('친구 요청을 찾을 수 없습니다.');
    }

    await this.checkBlockRelationship(
      friendRequest.requesterId,
      friendRequest.addresseeId,
    );

    await this.friendRequestRepository.remove(friendRequest);
  }

  // 친구 관계 삭제
  async deleteFriendship(friendshipId: number): Promise<void> {
    const friendship = await this.friendshipRepository.findOne({
      where: { friendshipId },
    });

    if (!friendship) {
      throw new NotFoundException('해당 친구 관계를 찾을 수 없습니다.');
    }

    await this.friendshipRepository.remove(friendship);
  }

  // 사용자 차단
  async blockUser(blockUserDto: BlockUserDto): Promise<void> {
    const { blockerId, blockedId } = blockUserDto;

    const friendship = await this.friendshipRepository.findOne({
      where: [
        { userId1: blockerId, userId2: blockedId },
        { userId1: blockedId, userId2: blockerId },
      ],
    });

    if (friendship) {
      // 차단 시 친구관계도 삭제됨.
      this.deleteFriendship(friendship.friendshipId);
    }

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

  async getSentFriendRequests(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseFriendRequestDto[]> {
    const skip = (page - 1) * limit;

    const requests = await this.friendRequestRepository.find({
      where: { requesterId: userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
      relations: ['addressee'], // 수신자 정보를 함께 가져옵니다.
    });

    if (!requests.length) {
      throw new NotFoundException('보낸 친구 요청을 찾을 수 없습니다.');
    }

    return requests.map((request) => ({
      requestId: request.requestId,
      requesterId: request.requesterId,
      addresseeId: request.addresseeId,
      addresseeName: request.addressee, // 수신자 이름
      createdAt: request.createdAt,
    }));
  }

  async getReceivedFriendRequests(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseFriendRequestDto[]> {
    const skip = (page - 1) * limit;

    const requests = await this.friendRequestRepository.find({
      where: { addresseeId: userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
      relations: ['requester'], // 발신자 정보를 함께 가져옵니다.
    });

    if (!requests.length) {
      throw new NotFoundException('받은 친구 요청을 찾을 수 없습니다.');
    }

    return requests.map((request) => ({
      requestId: request.requestId,
      requesterId: request.requesterId,
      addresseeId: request.addresseeId,
      requesterName: request.requester, // 발신자 이름
      createdAt: request.createdAt,
    }));
  }

  async unblockUser(blockUserDto: BlockUserDto): Promise<void> {
    const { blockerId, blockedId } = blockUserDto;

    const existingBlock = await this.userBlockRepository.findOne({
      where: { blockerId, blockedId },
    });

    if (!existingBlock) {
      throw new NotFoundException('차단된 사용자를 찾을 수 없습니다.');
    }

    await this.userBlockRepository.remove(existingBlock);
  }
}
