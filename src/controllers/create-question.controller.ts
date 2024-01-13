import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser, CurrentUserType } from '@/auth/current-user.decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { toSlug } from '@/helpers/slug'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { z } from 'zod'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})
const bodyPipes = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchemaType = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyPipes) body: CreateQuestionBodySchemaType,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    const { title, content } = body
    const { id: userId } = currentUser

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug: toSlug(title),
      },
    })

    return 'ok'
  }
}
