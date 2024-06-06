import { User } from '@domain/user/interfaces';
import '@fastify/request-context';

declare module '@fastify/request-context' {
  interface RequestContextData {
    user: User;
    scopes: string[];
  }
}
