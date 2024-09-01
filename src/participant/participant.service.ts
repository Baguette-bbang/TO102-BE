import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostParticipationRequest } from '../entities/post-participation-request.entity';
import { PostParticipant } from '../entities/post-participant.entity';
import { Post } from '../entities/post.entity';
import {
  CreateParticipationRequestDto,
  ParticipationRequestResponseDto,
  ParticipantResponseDto,
} from './dto/participant.dto';
import { UserBlock } from 'src/entities/user-block.entity';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(PostParticipationRequest)
    private participationRequestRepository: Repository<PostParticipationRequest>,
    @InjectRepository(PostParticipant)
    private participantRepository: Repository<PostParticipant>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(UserBlock)
    private userBlockRepository: Repository<UserBlock>,
  ) {}

  async createParticipationRequest(
    createDto: CreateParticipationRequestDto,
  ): Promise<ParticipationRequestResponseDto> {
    // 게시글 정보 가져오기
    const post = await this.postRepository.findOne({
      where: { postId: createDto.postId },
    });
    if (!post) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    // 요청자와 게시글 작성자가 동일한지 확인
    if (createDto.requesterId === post.userId) {
      throw new BadRequestException('요청자와 수신자는 동일할 수 없습니다.');
    }

    // 차단 여부 확인
    const isBlocked = await this.userBlockRepository.findOne({
      where: {
        blockerId: post.userId, // 게시글 작성자가 차단한 사용자
        blockedId: createDto.requesterId, // 요청자
      },
    });

    if (isBlocked) {
      throw new BadRequestException(
        '차단된 사용자에게는 참여 요청을 보낼 수 없습니다.',
      );
    }

    // 수신자 ID를 게시글 작성자의 ID로 설정
    const request = this.participationRequestRepository.create({
      ...createDto,
      addresseeId: post.userId,
    });

    const savedRequest =
      await this.participationRequestRepository.save(request);
    return this.mapToParticipationRequestResponseDto(savedRequest);
  }

  async acceptParticipationRequest(
    requestId: number,
  ): Promise<ParticipantResponseDto> {
    const request = await this.participationRequestRepository.findOne({
      where: { requestId },
    });

    if (!request) {
      throw new NotFoundException('참여 요청 정보를 찾을 수 없습니다.');
    }

    // 차단 여부 확인
    const isBlocked = await this.userBlockRepository.findOne({
      where: {
        blockerId: request.addresseeId, // 수신자가 차단한 사용자
        blockedId: request.requesterId, // 요청자
      },
    });

    if (isBlocked) {
      throw new BadRequestException(
        '차단된 사용자의 참여 요청을 수락할 수 없습니다.',
      );
    }

    const participant = this.participantRepository.create({
      postId: request.postId,
      userId: request.requesterId,
    });
    await this.participantRepository.save(participant);

    await this.participationRequestRepository.delete(request);

    return this.mapToParticipantResponseDto(participant);
  }

  async declineParticipationRequest(requestId: number): Promise<object> {
    const request = await this.participationRequestRepository.findOne({
      where: { requestId },
    });

    if (!request) {
      throw new NotFoundException('참여 요청 정보를 찾을 수 없습니다.');
    }

    await this.participationRequestRepository.delete(request);

    return { message: '참여 요청이 거절 및 취소 되었습니다.' };
  }

  async getParticipantsByPostId(
    postId: number,
  ): Promise<ParticipantResponseDto[]> {
    const participants = await this.participantRepository.find({
      where: { postId },
    });
    return participants.map(this.mapToParticipantResponseDto);
  }

  async cancelParticipation(id: number): Promise<void> {
    const result = await this.participantRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('참여 정보를 찾을 수 없습니다.');
    }
  }

  private mapToParticipationRequestResponseDto(
    request: PostParticipationRequest,
  ): ParticipationRequestResponseDto {
    return {
      requestId: request.requestId,
      postId: request.postId,
      requesterId: request.requesterId,
      addresseeId: request.addresseeId,
    };
  }

  private mapToParticipantResponseDto(
    participant: PostParticipant,
  ): ParticipantResponseDto {
    return {
      participantId: participant.participantId,
      postId: participant.postId,
      userId: participant.userId,
      createdAt: participant.createdAt,
      updatedAt: participant.updatedAt,
    };
  }
}
