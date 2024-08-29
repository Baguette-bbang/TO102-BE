import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FriendshipService } from './friendship.service';
import {
  CreateFriendRequestDto,
  BlockUserDto,
  ResponseFriendRequestDto,
  ResponseFriendshipDto,
} from './dto/friendship.dto';

@ApiTags('친구 관계')
@Controller('friendships')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('request')
  @ApiOperation({
    summary: '친구 요청 보내기',
    description: '친구 요청을 보냅니다. (차단 시 불가)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '친구 요청이 성공적으로 전송되었습니다.',
    type: ResponseFriendRequestDto,
  })
  sendFriendRequest(
    @Body() createFriendRequestDto: CreateFriendRequestDto,
  ): Promise<ResponseFriendRequestDto> {
    return this.friendshipService.sendFriendRequest(createFriendRequestDto);
  }

  @Post('request/:requestId/accept')
  @ApiOperation({
    summary: '친구 요청 수락',
    description: '친구 요청을 수락하여 친구 관계를 만듭니다. (차단 시 불가)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '친구 요청이 수락되었습니다.',
  })
  @ApiParam({ name: 'requestId', description: '요청 ID' })
  acceptFriendRequest(
    @Param('requestId') requestId: number,
  ): Promise<ResponseFriendshipDto> {
    return this.friendshipService.acceptFriendRequest(requestId);
  }

  @Delete('request/:requestId/decline')
  @ApiOperation({
    summary: '친구 요청 거절',
    description: '친구 요청을 거절합니다. (차단 시 불가)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '친구 요청이 거절되었습니다.',
  })
  @ApiParam({ name: 'requestId', description: '요청 ID' })
  declineFriendRequest(@Param('requestId') requestId: number): Promise<void> {
    return this.friendshipService.declineFriendRequest(requestId);
  }

  @Delete(':friendshipId/delete')
  @ApiOperation({
    summary: '친구 관계 삭제',
    description: '친구 관계를 삭제합니다.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '친구 관계가 삭제되었습니다.',
  })
  deleteFriendship(@Param('friendshipId') friendshipId: number): Promise<void> {
    return this.friendshipService.deleteFriendship(friendshipId);
  }

  @Post('block')
  @ApiOperation({
    summary: '사용자 차단',
    description: '사용자를 차단합니다. (차단 시 친구관계 자동 삭제)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자가 차단되었습니다.',
  })
  blockUser(@Body() blockUserDto: BlockUserDto): Promise<void> {
    return this.friendshipService.blockUser(blockUserDto);
  }

  @Get('requests/sent/:userId')
  @ApiOperation({
    summary: '보낸 친구 요청 조회',
    description:
      '아직 수락 또는 거절되지 않은 보낸 친구 요청을 모두 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보낸 친구 요청 목록',
    type: [ResponseFriendRequestDto],
  })
  @ApiParam({ name: 'userId', description: '요청을 보낸 사용자 ID' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지당 항목 수' })
  getSentFriendRequests(
    @Param('userId') userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<ResponseFriendRequestDto[]> {
    return this.friendshipService.getSentFriendRequests(userId, page, limit);
  }

  @Get('requests/received/:userId')
  @ApiOperation({
    summary: '받은 친구 요청 조회',
    description:
      '아직 수락 또는 거절되지 않은 받은 친구 요청을 모두 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '받은 친구 요청 목록',
    type: [ResponseFriendRequestDto],
  })
  @ApiParam({ name: 'userId', description: '요청을 받은 사용자 ID' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지당 항목 수' })
  getReceivedFriendRequests(
    @Param('userId') userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<ResponseFriendRequestDto[]> {
    return this.friendshipService.getReceivedFriendRequests(
      userId,
      page,
      limit,
    );
  }
}
