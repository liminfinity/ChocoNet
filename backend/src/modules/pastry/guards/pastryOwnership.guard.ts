import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PastryService } from '../services';
import { RequestWithUser } from '@/modules/auth';
import { SetOptional } from 'type-fest';

@Injectable()
export class PastryOwnershipGuard implements CanActivate {
  constructor(private readonly pastryService: PastryService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context
      .switchToHttp()
      .getRequest<SetOptional<RequestWithUser, 'user'>>();

    if (!user) {
      return false;
    }

    const { id: userId } = user;

    const { id: pastryId } = params;

    const existingPastry = await this.pastryService.findById(pastryId, userId);

    if (!existingPastry) {
      throw new NotFoundException('Pastry not found');
    }

    const isPastryOwnedByUser = await this.pastryService.isPartyOwnedByUser(pastryId, userId);

    if (!isPastryOwnedByUser) {
      throw new ForbiddenException('You do not have permission to modify this pastry');
    }

    return true;
  }
}
