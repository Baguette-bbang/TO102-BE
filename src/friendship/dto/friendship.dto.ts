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
