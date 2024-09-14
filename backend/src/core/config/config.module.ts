import * as joi from 'joi';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

export const ConfigModule = NestConfigModule.forRoot({
  isGlobal: true,
  validationSchema: joi.object({
    API_OLD_URL: joi.string().required(),
    API_DATABASE_URL: joi.string().required(),
    API_PORT: joi.number().port().default(3000),
    API_JWT_SECRET: joi.string().default('secret'),
    API_GROUP_AUTHORIZATION: joi.string().required(),
  }),
});
