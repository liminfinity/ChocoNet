import { UserDto } from '@/modules/user/dto';

export class AuthControllerResponse extends UserDto {}

export class LoginControllerResponse extends AuthControllerResponse {}

export class RefreshControllerResponse extends AuthControllerResponse {}

export class VerifyCodeControllerResponse extends AuthControllerResponse {}
