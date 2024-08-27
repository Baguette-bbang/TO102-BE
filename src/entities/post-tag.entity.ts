import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { Tag } from './tag.entity';

@Entity('post_tag')
export class PostTag {
  @PrimaryColumn({ name: 'post_id' })
  postId: number;

  @PrimaryColumn({ name: 'tag_id' })
  tagId: number;

  @ManyToOne(() => Post, (post) => post.postTags)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Tag, (tag) => tag.postTags)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
