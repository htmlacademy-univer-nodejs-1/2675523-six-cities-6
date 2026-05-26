import type { JWTPayload } from 'jose';
import type { UserType } from '../../../models/index.js';

export interface TokenPayloadInterface extends JWTPayload {
  id: string;
  name: string;
  type: UserType;
}
