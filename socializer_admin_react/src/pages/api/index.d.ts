import { IronSession } from 'iron-session';
import { IUserInfo } from 'store/userStore';

export type ISession = IronSession & Record<string, any>;
