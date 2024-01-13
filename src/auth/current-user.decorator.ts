import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { UserPayloadType } from './jwt.strategy'

export type CurrentUserType = {
  id: string
}

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    const userPayload = request.user as UserPayloadType

    return {
      id: userPayload.sub,
    }
  },
)
