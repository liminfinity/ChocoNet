import { User } from "@prisma/client";

export type JwtPayload = {
  sub: string;
} & Pick<User, 'email'>;
