import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostParticipationRequest } from '../entities/post-participation-request.entity';
import { PostParticipant } from '../entities/post-participant.entity';
import {
  CreateParticipationRequestDto,
  ParticipationRequestResponseDto,
  ParticipantResponseDto,
} from './dto/participant.dto';
@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(PostParticipationRequest)
    private participationRequestRepository: Repository<PostParticipationRequest>,
    @InjectRepository(PostParticipant)
    private participantRepository: Repository<PostParticipant>,
  ) {}

  async createParticipationRequest(
    createDto: CreateParticipationRequestDto,
  ): Promise<ParticipationRequestResponseDto> {
    const request = this.participationRequestRepository.create(createDto);
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

    const participant = this.participantRepository.create({
      postId: request.postId,
      participantId: request.requesterId,
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
