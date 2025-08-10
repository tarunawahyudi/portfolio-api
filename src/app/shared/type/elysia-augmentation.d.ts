import type { Logger } from './path/to/logger'

declare module "elysia" {
  interface Context {
    log: Logger;
    _requestStartTime: number;
  }
}
