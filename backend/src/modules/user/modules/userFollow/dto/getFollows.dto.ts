import { User, UserFollow } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { GetListDto } from '@/common/dto';
import { AvatarDto } from '@/modules/user/dto';

export class UserFollowDto implements Pick<User, 'id' | 'firstName' | 'lastName' | 'nickname'> {
  @ApiProperty({
    description: 'User id',
    example: '1',
  })
  id!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName!: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName!: string;

  @ApiProperty({
    description: 'User nickname',
    example: 'johndoe',
  })
  nickname!: string;

  @ApiProperty({
    description: 'User avatar',
    type: AvatarDto,
    examples: [
      {
        id: '1',
        path: '/path/to/avatar.png',
      },
      null,
    ],
  })
  avatar!: AvatarDto | null;
}

export class FollowDto implements Pick<UserFollow, 'createdAt'> {
  @ApiProperty({
    description: 'Followed user',
    type: UserFollowDto,
    example: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      nickname: 'johndoe',
      avatar: {
        id: '1',
        path: '/path/to/avatar.png',
      },
    },
  })
  user!: UserFollowDto;

  @ApiProperty({
    description: 'Follow creation date',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Follow id',
    example: '1',
  })
  id!: string;
}

export class GetFollowsDto extends GetListDto {
  @ApiProperty({
    description: 'List of follows',
    isArray: true,
    type: UserFollowDto,
  })
  data!: FollowDto[];
}
