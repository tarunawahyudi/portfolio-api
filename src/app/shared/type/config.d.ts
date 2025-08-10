export interface AppYamlConfig {
  app: {
    name: string
    version: string
    environment: string
    port: number
    baseUrl: string
  }
  database: {
    client: string
    host: string
    port: number
    username: string
    password: string
    database: string
    pool: {
      min: number
      max: number
    }
    ssl: boolean
  }
  resources: {
    banner: string
    dictionary: {
      error: string
    }
  },
  logger: {
    path: string
    level: string
    sentry: {
      enabled: boolean
      dsn: string
    },
    axiom: {
      enabled: boolean
      axiomDataset: string
      axiomToken: string
      axiomOrgId: string
    }
  },
  swagger: {
    path: string
    version: string
    provider: string
    darkMode: boolean
    title: string
    description: string
  }
  api: {
    prefix: string
    timeout: number
    rateLimit: {
      enabled: boolean
      windowMs: number
      maxRequests: number
    }
  }
  auth: {
    jwtSecret: string
    tokenExpiration: string
    refreshTokenExpiration: string
  }
  cors: {
    enabled: boolean
    origin: string[]
  }
  services: {
    email: {
      provider?: string | null
      host?: string | null
      port?: number | null
      username?: string | null
      password?: string | null
    }
    redis: {
      host?: string | null
      port?: number | null
      password?: string | null
    }
  }
  features: {
    enableNewFeatureX: boolean
    enableBetaMode: boolean
  }
  misc: {
    timezone: string
    maxUploadSize: string
  }
}
