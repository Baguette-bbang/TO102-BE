import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserOauth } from './user-oauth.entity';
import { UserLocation } from './user-location.entity';
import { UserRating } from './user-rating.entity';
import { UserBlock } from './user-block.entity';
import { Review } from './review.entity';
import { FriendRequest } from './friend-request.entity';
import { Friendship } from './friendship.entity';
import { Post } from './post.entity';
import { PostParticipationRequest } from './post-participation-request.entity';
import { PostParticipant } from './post-participant.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'username', nullable: true })
  username: string;

  @Column({ name: 'nickname' })
  nickname: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'profile_picture_url', nullable: true })
  profilePictureUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    name: 'last_login',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastLogin: Date;

  @OneToMany(() => UserOauth, (userOauth) => userOauth.user)
  oauths: UserOauth[];

  @OneToMany(() => UserLocation, (userLocation) => userLocation.user)
  userLocations: UserLocation[];

  @OneToOne(() => UserRating, (userRating) => userRating.user)
  rating: UserRating;

  @OneToMany(() => UserBlock, (userBlock) => userBlock.blocker)
  blockedUsers: UserBlock[];

  @OneToMany(() => UserBlock, (userBlock) => userBlock.blocked)
  blockedByUsers: UserBlock[];

  @OneToMany(() => Review, (review) => review.reviewer)
  givenReviews: Review[];

  @OneToMany(() => Review, (review) => review.reviewed)
  receivedReviews: Review[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.requester)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.addressee)
  receivedFriendRequests: FriendRequest[];

  @OneToMany(() => Friendship, (friendship) => friendship.user1)
  friendships1: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.user2)
  friendships2: Friendship[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => PostParticipationRequest, (request) => request.requester)
  sentParticipationRequests: PostParticipationRequest[];

  @OneToMany(() => PostParticipationRequest, (request) => request.addressee)
  receivedParticipationRequests: PostParticipationRequest[];

  @OneToMany(() => PostParticipant, (participant) => participant.user)
  participations: PostParticipant[];
}
