import { coerceStringToBoolean } from '@lib/utils';
import { ConfigType, registerAs } from '@nestjs/config';

export const featuresConfig = registerAs('features', () => ({
  authEnabled: process.env.AUTH_ENABLED
    ? coerceStringToBoolean(process.env.AUTH_ENABLED)
    : false,
}));

export type FeaturesConfig = ConfigType<typeof featuresConfig>;
