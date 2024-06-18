import { Module } from '@nestjs/common';
import { Auth0Service } from './services';

@Module({ providers: [Auth0Service], exports: [Auth0Service] })
export class Auth0Module {}
