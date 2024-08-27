import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_oauth')
@Unique(['oauthProvider', 'oauthId'])
export class UserOauth {
  @PrimaryGeneratedColumn({ name: 'user_oauth_id' })
  userOauthId: number;

  @Column({ name: 'oauth_provider' })
  oauthProvider: string;

  @Column({ name: 'oauth_id' })
  oauthId: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({
    name: 'refresh_token_expires_at',
    type: 'timestamp',
    nullable: true,
  })
  refreshTokenExpiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.oauths)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
