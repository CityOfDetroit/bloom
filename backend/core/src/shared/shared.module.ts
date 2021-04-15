import { Module } from "@nestjs/common"
import { SendGridModule } from "@anchan828/nest-sendgrid"
import { EmailService } from "./email.service"
import { ConfigModule, ConfigService } from "@nestjs/config"
import Joi from "joi"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3100).required(),
        NODE_ENV: Joi.string()
          .valid("development", "staging", "production", "test")
          .default("development"),
        DATABASE_URL: Joi.string().required(),
        REDIS_TLS_URL: Joi.string().required(),
      }),
    }),
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apikey: configService.get<string>("EMAIL_API_KEY"),
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class SharedModule {}
