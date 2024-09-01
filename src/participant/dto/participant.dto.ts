import { PickType } from '@nestjs/swagger';
import { PostParticipationRequest } from '../../entities/post-participation-request.entity';
import { PostParticipant } from '../../entities/post-participant.entity';

export class CreateParticipationRequestDto extends PickType(
  PostParticipationRequest,
  ['postId', 'requesterId'] as const,
) {}

export class ParticipationRequestResponseDto extends PickType(
  PostParticipationRequest,
  ['requestId', 'postId', 'requesterId', 'addresseeId'] as const,
) {}

export class ParticipantResponseDto extends PickType(PostParticipant, [
  'participantId',
  'postId',
  'userId',
  'createdAt',
  'updatedAt',
] as const) {}
