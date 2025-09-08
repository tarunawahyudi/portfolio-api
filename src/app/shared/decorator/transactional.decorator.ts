import { db } from '@db/index'
import { AsyncLocalStorage } from "node:async_hooks"

export const transactionContext = new AsyncLocalStorage<any>()

export function getDbOrTx() {
  const store = transactionContext.getStore()
  return store?.tx ?? db
}

export function Transactional() {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      return await db.transaction(async (tx) => {
        return await transactionContext.run({ tx }, async () => {
          return originalMethod.apply(this, args)
        })
      })
    }
  }
}
