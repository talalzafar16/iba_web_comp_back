import { Request } from 'express';
import { UserPayload } from 'src/auth/interfaces/user_payload.interface';
import { OrganizationPayload } from 'src/auth/types/organization_payload.types';

export interface UserPayloadRequest extends Request {
  user: UserPayload;
}

export interface OrganizationEmployeePayloadRequest extends UserPayloadRequest {
  org: OrganizationPayload;
}
