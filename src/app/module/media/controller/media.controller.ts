import { AppResponse } from '@shared/type/global'
import { Context } from 'elysia'

export interface MediaController {
  remove(ctx: Context): Promise<AppResponse>;
}
