import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { PostParticipationRequest } from '../entities/post-participation-request.entity';
import { PostParticipant } from '../entities/post-participant.entity';
import { Post } from 'src/entities/post.entity';
import { UserBlock } from 'src/entities/user-block.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostParticipationRequest,
      PostParticipant,
      Post,
      UserBlock,
    ]),
  ],
  controllers: [ParticipantController],
  providers: [ParticipantService],
  exports: [ParticipantService],
})
export class ParticipantModule {}
