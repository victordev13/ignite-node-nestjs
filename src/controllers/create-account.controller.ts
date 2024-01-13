import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { PrismaService } from 'src/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { hash } from 'bcryptjs'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodySchemaType = z.infer<typeof createAccountBodySchema>

@Controller('/accounts/create')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchemaType) {
    const { name, email, password } = body

    const usetWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (usetWithSameEmail) {
      throw new ConflictException('User with same email already exists')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    })
  }
}
