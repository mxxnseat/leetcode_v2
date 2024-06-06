import { ConfigType, registerAs } from '@nestjs/config';

export const scopes = {
  problem: {
    list: 'problems:list',
    create: 'problems:create',
    retrieve: 'problems:retrieve',
    update: 'problems:update',
    delete: 'problems:delete',
  },
  judge: {
    list: 'judges:list',
    create: 'judges:create',
    retrieve: 'judges:retrieve',
    delete: 'judges:delete',
  },
} as const;

const userRole = [
  scopes.problem.create,
  scopes.problem.list,
  scopes.problem.delete,
  scopes.problem.retrieve,
  scopes.problem.update,
];

const adminRole = [
  ...userRole,
  scopes.judge.create,
  scopes.judge.list,
  scopes.judge.delete,
  scopes.judge.retrieve,
];
export const scopesConfig = registerAs('scopes', () => ({
  user: userRole,
  admin: adminRole,
}));

export type ScopesConfig = ConfigType<typeof scopesConfig>;
