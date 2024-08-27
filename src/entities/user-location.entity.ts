import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Location } from './location.entity';

@Entity('user_location')
export class UserLocation {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'location_id' })
  locationId: number;

  @ManyToOne(() => User, (user) => user.userLocations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Location, (location) => location.userLocations)
  @JoinColumn({ name: 'location_id' })
  location: Location;
}
