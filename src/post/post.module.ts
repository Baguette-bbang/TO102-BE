import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from '../entities/post.entity';
import { PostTag } from '../entities/post-tag.entity';
import { Tag } from '../entities/tag.entity';
import { Location } from '../entities/location.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostTag, Tag, Location, User])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
