import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FriendshipService } from './friendship.service';
import { CreateFriendRequestDto, BlockUserDto } from './dto/friendship.dto';

@ApiTags('친구 관계')
@Controller('friendships')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('request')
  @ApiOperation({
    summary: '친구 요청 보내기',
    description: '친구 요청을 보냅니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '친구 요청이 성공적으로 전송되었습니다.',
  })
  sendFriendRequest(
    @Body() createFriendRequestDto: CreateFriendRequestDto,
  ): Promise<void> {
    return this.friendshipService.sendFriendRequest(createFriendRequestDto);
  }

  @Post('accept/:requesterId/:addresseeId')
  @ApiOperation({
    summary: '친구 요청 수락',
    description: '친구 요청을 수락하여 친구 관계를 만듭니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '친구 요청이 수락되었습니다.',
  })
  acceptFriendRequest(
    @Param('requesterId') requesterId: number,
    @Param('addresseeId') addresseeId: number,
  ): Promise<void> {
    return this.friendshipService.acceptFriendRequest(requesterId, addresseeId);
  }

  @Delete('decline/:requesterId/:addresseeId')
  @ApiOperation({
    summary: '친구 요청 거절',
    description: '친구 요청을 거절합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '친구 요청이 거절되었습니다.',
  })
  declineFriendRequest(
    @Param('requesterId') requesterId: number,
    @Param('addresseeId') addresseeId: number,
  ): Promise<void> {
    return this.friendshipService.declineFriendRequest(
      requesterId,
      addresseeId,
    );
  }

  @Delete(':userId1/:userId2')
  @ApiOperation({
    summary: '친구 관계 삭제',
    description: '친구 관계를 삭제합니다.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '친구 관계가 삭제되었습니다.',
  })
  deleteFriendship(
    @Param('userId1') userId1: number,
    @Param('userId2') userId2: number,
  ): Promise<void> {
    return this.friendshipService.deleteFriendship(userId1, userId2);
  }

  @Post('block')
  @ApiOperation({ summary: '사용자 차단', description: '사용자를 차단합니다.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자가 차단되었습니다.',
  })
  blockUser(@Body() blockUserDto: BlockUserDto): Promise<void> {
    return this.friendshipService.blockUser(blockUserDto);
  }
}
