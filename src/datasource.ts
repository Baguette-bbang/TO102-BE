import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

import { FriendRequest } from './entities/friend-request.entity';
import { Friendship } from './entities/friendship.entity';
import { Location } from './entities/location.entity';
import { PostTag } from './entities/post-tag.entity';
import { Post } from './entities/post.entity';
import { Review } from './entities/review.entity';
import { Tag } from './entities/tag.entity';
import { UserBlock } from './entities/user-block.entity';
import { UserLocation } from './entities/user-location.entity';
import { UserOauth } from './entities/user-oauth.entity';
import { UserRating } from './entities/user-rating.entity';
import { User } from './entities/user.entity';
import { PostParticipant } from './entities/post-participant.entity';
import { PostParticipationRequest } from './entities/post-participant-request.entity';

config();
const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    FriendRequest,
    Friendship,
    Location,
    PostTag,
    Post,
    Review,
    Tag,
    UserBlock,
    UserLocation,
    UserOauth,
    UserRating,
    User,
    PostParticipant,
    PostParticipationRequest,
  ],
  //migrations: ['src/migrations/*.ts'],
  logging: process.env.NODE_ENV === 'development',
  ssl:
    configService.get('NODE_ENV') === 'production'
      ? { rejectUnauthorized: false }
      : false,
  logger: 'advanced-console',
  //synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
