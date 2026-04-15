import {UserType} from '../../../models/index.js';

export interface UserDtoInterface {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: UserType
}
