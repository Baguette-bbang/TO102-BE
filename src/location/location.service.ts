import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  AddressInfo,
  LocationResponseDto,
  ProvinceCitiesResponseDto,
  ProvinceResponseDto,
} from './dto/location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { User } from 'src/entities/user.entity';
import { UserLocation } from '../entities/user-location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserLocation)
    private userLocationRepository: Repository<UserLocation>,
    private configService: ConfigService,
  ) {}

  async getLocationById(id: number): Promise<LocationResponseDto> {
    const location = await this.locationRepository.findOne({
      where: { locationId: id },
    });

    if (!location) {
      throw new NotFoundException(`ID가 ${id}인 위치를 찾을 수 없습니다`);
    }

    return {
      locationId: location.locationId,
      province: location.province,
      city: location.city,
    };
  }

  private isValidCoordinate(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
    );
  }

  async getAddressFromCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<AddressInfo> {
    if (!this.isValidCoordinate(latitude, longitude)) {
      throw new BadRequestException('올바르지 않은 좌표 정보입니다.');
    }

    const apiKey = this.configService.get<string>('KAKAO_CLIENT_ID');
    if (!apiKey) {
      throw new InternalServerErrorException(
        'Kakao API 키가 유효하지 않습니다',
      );
    }

    try {
      const response = await axios.get(
        'https://dapi.kakao.com/v2/local/geo/coord2address.json',
        {
          params: { x: longitude, y: latitude },
          headers: { Authorization: `KakaoAK ${apiKey}` },
        },
      );

      const addressInfo = response.data.documents[0]?.address;
      if (!addressInfo) {
        throw new NotFoundException(
          '주어진 좌표에 해당하는 주소를 찾을 수 없습니다.',
        );
      }

      return {
        province: addressInfo.region_1depth_name,
        city: addressInfo.region_2depth_name,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '주소 정보를 가져오는 데 실패했습니다',
      );
    }
  }

  async getCitiesByProvince(
    province: string,
  ): Promise<ProvinceCitiesResponseDto> {
    const locations = await this.locationRepository
      .createQueryBuilder('location')
      .select('DISTINCT location.city', 'city')
      .where('location.province = :province', { province })
      .orderBy('location.city', 'ASC')
      .getRawMany();

    if (!locations || locations.length === 0) {
      throw new NotFoundException(
        `${province}에 해당하는 도시를 찾을 수 없습니다`,
      );
    }

    const cities = locations.map((location) => location.city);

    return {
      province,
      cities,
    };
  }

  async getProvinces(): Promise<ProvinceResponseDto> {
    const locations = await this.locationRepository
      .createQueryBuilder('location')
      .select('DISTINCT location.province', 'province')
      .orderBy('location.province', 'ASC')
      .getRawMany();

    const provinces = locations.map((location) => location.province);

    return {
      provinces: provinces,
    };
  }

  async updateUserLocation(
    userId: number,
    latitude: number,
    longitude: number,
  ): Promise<LocationResponseDto> {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['userLocations'],
    });

    if (!user) {
      throw new NotFoundException(`ID가 ${userId}인 사용자를 찾을 수 없습니다`);
    }

    const addressInfo = await this.getAddressFromCoordinates(
      latitude,
      longitude,
    );

    // 위치 찾기 또는 생성
    let location = await this.locationRepository.findOne({
      where: { province: addressInfo.province, city: addressInfo.city },
    });

    if (!location) {
      location = this.locationRepository.create({
        province: addressInfo.province,
        city: addressInfo.city,
      });
      await this.locationRepository.save(location);
    }

    // 사용자-위치 관계 생성 또는 업데이트
    let userLocation = await this.userLocationRepository.findOne({
      where: { userId, locationId: location.locationId },
    });

    if (!userLocation) {
      userLocation = this.userLocationRepository.create({
        user,
        location,
      });
    } else {
      userLocation.location = location;
    }

    await this.userLocationRepository.save(userLocation);

    return {
      locationId: location.locationId,
      province: location.province,
      city: location.city,
    };
  }
}
