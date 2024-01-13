import { Module } from '@nestjs/common'
import { PrismaService } from './infra/database/prisma/prisma.service'
import { ConfigModule } from '@nestjs/config'
import { CreateAccountController } from './controllers/create-account.controller'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { RecentQuestionsController } from './controllers/recent-questions.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      // validate env variables with custom zod schema
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    RecentQuestionsController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
