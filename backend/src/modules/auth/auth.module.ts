import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HashModule } from 'src/common/modules';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    HashModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m', issuer: process.env.JWT_ISSUER },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
