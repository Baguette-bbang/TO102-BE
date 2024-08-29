import { ApiProperty } from '@nestjs/swagger';

export class CreateFriendRequestDto {
  @ApiProperty({ description: '요청자 ID', example: 1 })
  requesterId: number;

  @ApiProperty({ description: '수신자 ID', example: 2 })
  addresseeId: number;
}

export class BlockUserDto {
  @ApiProperty({ description: '차단자 ID', example: 1 })
  blockerId: number;

  @ApiProperty({ description: '차단된 사용자 ID', example: 2 })
  blockedId: number;
}

export class DeleteFriendRequestDto {
  @ApiProperty({ description: '요청자 ID', example: 1 })
  userId1: number;

  @ApiProperty({ description: '수신자 ID', example: 2 })
  userId2: number;
}

export class ResponseFriendRequestDto {
  @ApiProperty({ description: '요청된 친구신청 Id', example: 1 })
  requestId: number;
}

export class ResponseFriendshipDto {
  @ApiProperty({ description: '완료된 친구관계 Id', example: 1 })
  friendshipId: number;
}
