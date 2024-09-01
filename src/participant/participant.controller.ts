import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ParticipantService } from './participant.service';
import {
  CreateParticipationRequestDto,
  ParticipationRequestResponseDto,
  ParticipantResponseDto,
} from './dto/participant.dto';
@ApiTags('여행 참여')
@Controller('participant')
export class ParticipantController {
  constructor(private readonly participationService: ParticipantService) {}

  @Post('request')
  @ApiOperation({ summary: '참여 요청' })
  @ApiResponse({ status: 201, type: ParticipationRequestResponseDto })
  async createParticipationRequest(
    @Body() createDto: CreateParticipationRequestDto,
  ): Promise<ParticipationRequestResponseDto> {
    return this.participationService.createParticipationRequest(createDto);
  }

  @Post('request/:requestId/accept')
  @ApiOperation({ summary: '참여 요청 수락' })
  @ApiResponse({ status: 200, type: ParticipantResponseDto })
  async acceptParticipationRequest(
    @Param('requestId') requestId: number,
  ): Promise<ParticipantResponseDto> {
    return this.participationService.acceptParticipationRequest(requestId);
  }

  @Delete('request/:requestId/decline')
  @ApiOperation({ summary: '참여 요청 거절' })
  @ApiResponse({
    status: 200,
    description: '참여 요청이 거절 및 취소 되었습니다.',
  })
  async declineParticipationRequest(
    @Param('requestId') requestId: number,
  ): Promise<object> {
    return this.participationService.declineParticipationRequest(requestId);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: '특정 게시글의 참여자 조회' })
  @ApiResponse({ status: 200, type: [ParticipantResponseDto] })
  async getParticipantsByPostId(
    @Param('postId') postId: number,
  ): Promise<ParticipantResponseDto[]> {
    return this.participationService.getParticipantsByPostId(postId);
  }

  @Delete(':id')
  @ApiOperation({ summary: '참여 취소' })
  @ApiResponse({ status: 204 })
  async cancelParticipation(@Param('id') id: number): Promise<void> {
    return this.participationService.cancelParticipation(id);
  }

  // 특정 유저의 참여 정보 조회
}
