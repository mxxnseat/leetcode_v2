import { ConfigType, registerAs } from '@nestjs/config';

export const scopes = {
  problem: {
    list: 'problems:list',
    listPendings: 'problems:list-pendings',
    create: 'problems:create',
    retrieve: 'problems:retrieve',
    update: 'problems:update',
    updateStatus: 'problems:update-status',
    delete: 'problems:delete',
  },
  judge: {
    list: 'judges:list',
    create: 'judges:create',
    retrieve: 'judges:retrieve',
    delete: 'judges:delete',
  },
  comment: {
    list: 'comments:list',
    create: 'comments:create',
    update: 'comments:update',
    delete: 'comments:delete',
  },
} as const;

const userRole = [
  scopes.problem.create,
  scopes.problem.list,
  scopes.problem.delete,
  scopes.problem.retrieve,
  scopes.problem.update,
  scopes.judge.create,
  scopes.judge.retrieve,
  scopes.judge.list,
  scopes.comment.create,
  scopes.comment.list,
  scopes.comment.delete,
  scopes.comment.update,
];

const adminRole = [
  ...userRole,
  scopes.problem.updateStatus,
  scopes.problem.listPendings,
  scopes.judge.delete,
];
export const scopesConfig = registerAs('scopes', () => ({
  user: userRole,
  admin: adminRole,
}));

export type ScopesConfig = ConfigType<typeof scopesConfig>;
