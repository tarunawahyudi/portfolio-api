import {
  boolean,
  date, doublePrecision,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { CertificateDisplay } from '@module/certificate/dto/certificate.dto'

export const userStatusEnum = pgEnum('user_status', [
  'pending',
  'active',
  'inactive',
  'banned',
  'deleted',
])

export const articleStatusEnum = pgEnum('article_status', [
  'draft',
  'published',
  'deleted',
])

export const visibilityEnum = pgEnum('visibility', [
  'public',
  'private'
])

export const portfolioStatusEnum = pgEnum('portfolio_status', [
  'draft',
  'published',
  'archived'
])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }).notNull().unique(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash').notNull(),
  status: userStatusEnum('status').default('pending').notNull(),
  currentHashedRefreshToken: text('current_hashed_refresh_token'),
  isVerified: boolean('is_verified').default(false),
  failedAttempts: integer("failed_attempts").default(0).notNull(),
  lockUntil: timestamp("lock_until", { withTimezone: true }),

  lastLogin: timestamp('last_login', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const loginAttempts = pgTable('login_attempts', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  attemptTime: timestamp('attempt_time', { withTimezone: true }).defaultNow().notNull(),
  success: boolean('success').notNull(),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: varchar('user_agent', { length: 255 }),
  device: varchar('device', { length: 50 }),
  browser: varchar('browser', { length: 50 }),
  os: varchar('os', { length: 50 }),
  cpu: varchar('cpu', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const passwordResets = pgTable("password_resets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  tokenHash: varchar("token_hash", { length: 255 }).notNull().unique(),
  isUsed: boolean("is_used").default(false).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  fullName: varchar('full_name'),
  jobTitle: varchar('job_title', { length: 100 }),
  displayName: varchar('display_name', { length: 100 }),
  bio: text('bio'),
  address: text('address'),
  avatar: varchar('avatar'),
  socials: jsonb('socials').$type<Record<string, string>>().default({}),
  website: varchar('website', { length: 100 }),
  hobbies: text('hobbies').array(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull(),
  value: text('value').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  author: varchar('author', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique(),
  content: text('content'),
  thumbnail: text('thumbnail'),
  tags: text('tags').array(),
  status: articleStatusEnum('status').default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const certificates = pgTable('certificates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  organization: varchar('organization', { length: 255 }),
  issueDate: date('issue_date'),
  expirationDate: date('expiration_date'),
  certificateImage: text('certificate_image'),
  credentialId: varchar('credential_id', { length: 255 }),
  credentialUrl: varchar('credential_url', { length: 500 }),
  description: text('description'),
  display: jsonb('display').$type<CertificateDisplay>().default({ type: 'default', value: 'award' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const skills = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  proficiency: integer('proficiency').notNull(),
  category: varchar('category'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const educations = pgTable('educations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  institution: varchar('institution', { length: 200 }).notNull(),
  degree: varchar('degree', { length: 200 }),
  fieldOfStudy: varchar('field_of_study', { length: 200 }),
  grade: varchar('grade', { length: 50 }),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  device: varchar('device', { length: 50 }),
  os: varchar('os', { length: 50 }),
  browser: varchar('browser', { length: 50 }),
})

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  institution: varchar('institution').notNull(),
  courseName: varchar('course_name').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const workExperiences = pgTable('work_experiences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  company: varchar('company', { length: 100 }).notNull(),
  position: varchar('position', { length: 100 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  isCurrent: boolean('isCurrent'),
  jobDescription: text('job_description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const portfolios = pgTable('portfolios', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title').notNull(),
  category: varchar('category').notNull(),
  status: portfolioStatusEnum('status').default('draft').notNull(),
  visibility: visibilityEnum('visibility').default('public').notNull(),
  isFeatured: boolean("is_featured").default(false),
  projectUrl: varchar('project_url'),
  repoUrl: varchar('repo_url'),
  demoUrl: text("demo_url"),
  summary: varchar("summary", { length: 500 }),
  description: text('description'),
  thumbnail: text('thumbnail'),
  externalVideoUrl: text('external_video_url'),
  selfHostedVideoUrl: text('self_hosted_video_url'),
  techStack: text('tech_stack').array(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const portfolioViews = pgTable('portfolio_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  portfolioId: uuid('portfolio_id')
    .notNull()
    .references(() => portfolios.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  ipAddress: varchar('ip_address', { length: 45 }),
  country: varchar('country'),
  region: varchar('region'),
  city: varchar('city'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const awards = pgTable('awards', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description'),
  images: text('images').array(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const emailVerification = pgTable('email_verifications', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  used: boolean('is_verified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const portfolioGallery = pgTable('portfolio_gallery', {
  id: uuid('id').primaryKey().defaultRandom(),
  portfolioId: uuid('portfolio_id')
    .notNull()
    .references(() => portfolios.id, { onDelete: 'cascade' }),
  path: text('path'),
  size: integer('size'),
  fileType: varchar('file_type', { length: 100 }),
  order: integer('order'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

// RELATIONS
export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  settings: many(settings),
  testimonials: many(testimonials),
  articles: many(articles),
  certificates: many(certificates),
  skills: many(skills),
  educations: many(educations),
  courses: many(courses),
  workExperiences: many(workExperiences),
  portfolios: many(portfolios),
  awards: many(awards),
  emailVerifications: many(emailVerification),
  passwordResets: many(passwordResets),
}))

export const profileRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}))

export const passwordResetRelations = relations(passwordResets, ({ one }) => ({
  user: one(users, {
    fields: [passwordResets.userId],
    references: [users.id],
  })
}))

export const emailVerificationRelations = relations(emailVerification, ({ one }) => ({
  user: one(users, {
    fields: [emailVerification.userId],
    references: [users.id],
  })
}))

export const settingRelations = relations(settings, ({ one }) => ({
  user: one(users, {
    fields: [settings.userId],
    references: [users.id],
  }),
}))

export const testimonialRelations = relations(testimonials, ({ one }) => ({
  user: one(users, {
    fields: [testimonials.userId],
    references: [users.id],
  }),
}))

export const articleRelations = relations(articles, ({ one }) => ({
  user: one(users, {
    fields: [articles.userId],
    references: [users.id],
  }),
}))

export const certificateRelations = relations(certificates, ({ one }) => ({
  user: one(users, {
    fields: [certificates.userId],
    references: [users.id],
  }),
}))

export const skillRelations = relations(skills, ({ one }) => ({
  user: one(users, {
    fields: [skills.userId],
    references: [users.id],
  }),
}))

export const educationRelations = relations(educations, ({ one }) => ({
  user: one(users, {
    fields: [educations.userId],
    references: [users.id],
  }),
}))

export const courseRelations = relations(courses, ({ one }) => ({
  user: one(users, {
    fields: [courses.userId],
    references: [users.id],
  }),
}))

export const workExperienceRelations = relations(workExperiences, ({ one }) => ({
  user: one(users, {
    fields: [workExperiences.userId],
    references: [users.id],
  }),
}))

export const portfolioRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id],
  }),
  gallery: many(portfolioGallery),
  viewCount: many(portfolioViews),
}))

export const portfolioGalleryRelations = relations(
  portfolioGallery,
  ({ one }) => ({
    portfolio: one(portfolios, {
      fields: [portfolioGallery.portfolioId],
      references: [portfolios.id],
    }),
  }),
)

export const portfolioViewRelations = relations(
  portfolioViews,
  ({ one }) => ({
    portfolio: one(portfolios, {
      fields: [portfolioViews.portfolioId],
      references: [portfolios.id],
    })
  })
)

export const awardRelations = relations(awards, ({ one }) => ({
  user: one(users, {
    fields: [awards.userId],
    references: [users.id],
  }),
}))
