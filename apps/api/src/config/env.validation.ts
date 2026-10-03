import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  API_PORT: Joi.number().port().default(3001),

  DB_HOST: Joi.string().required(),

  DB_PORT: Joi.number().port().default(3306),

  DB_NAME: Joi.string().required(),

  DB_USER: Joi.string().required(),

  DB_PASSWORD: Joi.string().allow('').required(),
});
