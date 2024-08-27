import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserLocation } from './user-location.entity';
import { Post } from './post.entity';

@Entity('location')
export class Location {
  @PrimaryGeneratedColumn({ name: 'location_id' })
  locationId: number;

  @Column({ name: 'province', length: 100 })
  province: string;

  @Column({ name: 'city', length: 100 })
  city: string;

  @OneToMany(() => UserLocation, (userLocation) => userLocation.location)
  userLocations: UserLocation[];

  @OneToMany(() => Post, (post) => post.location)
  posts: Post[];
}
