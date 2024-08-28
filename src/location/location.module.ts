import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Location } from '../entities/location.entity';
import { User } from '../entities/user.entity';
import { UserLocation } from '../entities/user-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, User, UserLocation])],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
