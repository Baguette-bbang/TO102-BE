import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PostTag } from './post-tag.entity';

@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn({ name: 'tag_id' })
  tagId: number;

  @Column({ name: 'name', length: 50, unique: true })
  name: string;

  @OneToMany(() => PostTag, (postTag) => postTag.tag)
  postTags: PostTag[];
}
