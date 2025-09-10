import { InferSelectModel, eq, like, or, asc, desc, sql, count, SQL, and } from 'drizzle-orm'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { AnyPgColumn, PgTable } from 'drizzle-orm/pg-core'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export async function paginate<T extends PgTable>(
  db: PostgresJsDatabase<any>,
  table: T,
  options: PaginationOptions,
  searchColumns: AnyPgColumn[] = [],
  whereCondition: SQL<unknown> | undefined = undefined
): Promise<PaginatedResponse<InferSelectModel<T>>> {
  const page = Math.max(1, options.page ?? 1)
  const limit = Math.max(1, options.limit ?? 10)
  const offset = (page - 1) * limit

  const combinedWhereConditions: SQL<unknown>[] = []

  if (whereCondition) {
    combinedWhereConditions.push(whereCondition)
  }

  if (options.filters) {
    for (const key in options.filters) {
      if (Object.prototype.hasOwnProperty.call(options.filters, key) && options.filters[key] !== undefined && options.filters[key] !== null) {
        const column = (table as any)[key]
        if (column) {
          combinedWhereConditions.push(eq(column, options.filters[key]))
        } else {
          console.warn(`Column '${key}' not found in table for filtering. Skipped.`)
        }
      }
    }
  }

  if (options.search && searchColumns.length > 0) {
    const searchTerm = `%${options.search.toLowerCase()}%`
    const searchConditions = searchColumns
      .filter(col => col)
      .map(col => like(sql`lower(${col})`, searchTerm))

    const orCondition = or(...searchConditions)
    if (orCondition !== undefined) {
      combinedWhereConditions.push(orCondition)
    }
  }

  let queryBuilder = db.select().from(table as any).$dynamic()

  if (combinedWhereConditions.length > 0) {
    queryBuilder = queryBuilder.where(and(...combinedWhereConditions))
  }

  if (options.sort) {
    const orderByConditions: SQL<unknown>[] = []
    for (const key in options.sort) {
      if (Object.prototype.hasOwnProperty.call(options.sort, key)) {
        const column = (table as any)[key]
        if (column) {
          orderByConditions.push(options.sort[key] === 'asc' ? asc(column) : desc(column))
        } else {
          console.warn(`Column '${key}' not found in table for sorting. Skipped.`)
        }
      }
    }
    if (orderByConditions.length > 0) {
      queryBuilder = queryBuilder.orderBy(...orderByConditions)
    }
  }

  const countQuery = db.select({ count: count() }).from(table as any)
  if (combinedWhereConditions.length > 0) {
    countQuery.where(and(...combinedWhereConditions))
  }
  const countResult = await countQuery.execute()
  const totalItems = countResult[0].count

  const data = await queryBuilder
    .limit(limit)
    .offset(offset)
    .execute()

  const totalPages = Math.ceil(totalItems / limit)

  return {
    data: data as InferSelectModel<T>[],
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    },
  }
}

export function parsePaginationOptions(query: { [key: string]: any }): PaginationOptions {
  const { page, limit, sort, search, ...filters } = query

  const options: PaginationOptions = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search,
    filters: {}
  }

  if (sort && typeof sort === 'string') {
    options.sort = {}
    sort.split(',').forEach(s => {
      const [field, direction] = s.split(':')
      if (field && (direction === 'asc' || direction === 'desc')) {
        options.sort![field] = direction
      }
    })
  }

  for (const key in filters) {
    if (Object.prototype.hasOwnProperty.call(filters, key) && filters[key] !== undefined && filters[key] !== null) {
      options.filters![key] = filters[key]
    }
  }

  return options
}
