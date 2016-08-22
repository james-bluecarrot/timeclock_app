import { Auth, IUser } from './auth';
import { Data } from './data';
import { Loader } from './loader';

export const SERVICES: Array<any> = [Auth, Data, Loader];

export {
  Auth,
  IUser,
  Data,
  Loader
}
