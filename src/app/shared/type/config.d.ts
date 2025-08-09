export interface AppYamlConfig {
  app: {
    name: string
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
  logger: {
    level: string
    file: string
    maxSize: string
    maxFiles: number
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
    methods: string[]
    headers: string[]
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
