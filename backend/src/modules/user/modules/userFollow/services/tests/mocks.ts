import { BaseFindUserServiceResponse } from "@/modules/user/services/types";
import { faker } from "@faker-js/faker";
import { FollowType, GetFollowQueriesDto, GetFollowsDto } from "../../dto";
import { GetFollowsResponse } from "../../repositories/types";
import { getLinkToAvatar } from "@/modules/user/lib";

export const mockFollowerId = faker.string.uuid();

export const mockFollowingId = faker.string.uuid();

export const mockUser: BaseFindUserServiceResponse = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  nickname: faker.internet.username(),
  password: faker.internet.password(),
  phone: faker.phone.number(),
  about: faker.person.bio(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  geolocation: {
    lat: faker.location.latitude(),
    lng: faker.location.longitude(),
  },
  avatars: [],
}

export const mockQuery: GetFollowQueriesDto = {
  name: '',
  orderBy: 'createdAt',
  order: 'desc',
  followType: FollowType.FOLLOWER,
  pagination: {
    limit: 10,
    cursor: faker.string.uuid(),
  }
};

export const mockGetFollows: GetFollowsResponse = [
  {
    id: faker.string.uuid(),
    createdAt: faker.date.recent(),
    user: {
      avatar: {
        id: faker.string.uuid(),
        filename: faker.image.url()
      },
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      nickname: faker.internet.username(),
    }
  }
]

export const mockGetFollowsDto: GetFollowsDto = {
  data: mockGetFollows.map(follow => ({
    ...follow,
    user: {
      ...follow.user,
      avatar: follow.user.avatar && {
        id: follow.user.avatar.id,
        path: getLinkToAvatar(follow.user.avatar.filename),
      }
    }
  })),
  nextCursor: mockGetFollows[mockGetFollows.length - 1].id,
}
