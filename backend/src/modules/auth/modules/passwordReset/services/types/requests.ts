import { UpdatePasswordDto } from '../../dto';

export type UpdatePasswordServiceRequest = Omit<UpdatePasswordDto, 'confirmPassword'>;
