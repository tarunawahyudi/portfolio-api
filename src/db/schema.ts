import {
  boolean,
  date,
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

export const userStatusEnum = pgEnum('user_status', [
  'pending',
  'active',
  'inactive',
  'banned',
  'deleted',
])

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
})

export const menus = pgTable('menus', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  path: varchar('path', { length: 100 }),
  iconName: varchar('icon_name', { length: 50 }),
  parentId: integer('parent_id'),
})

export const roleMenus = pgTable('role_menus', {
  id: serial('id').primaryKey(),
  roleId: integer('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'cascade' }),
  menuId: integer('menu_id')
    .notNull()
    .references(() => menus.id, { onDelete: 'cascade' }),
})

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

  roleId: integer('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'restrict' }),

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

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  fullName: varchar('full_name'),
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
  credentialId: varchar('credential_id', { length: 255 }),
  credentialUrl: varchar('credential_url', { length: 500 }),
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
  description: text('description'),
  thumbnail: text('thumbnail'),
  techStack: text('tech_stack').array(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
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

// RELATIONS
export const userRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
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
}))

export const roleRelations = relations(roles, ({ many }) => ({
  users: many(users),
  roleMenus: many(roleMenus),
}))

export const menuRelations = relations(menus, ({ many }) => ({
  roleMenus: many(roleMenus),
}))

export const roleMenuRelations = relations(roleMenus, ({ one }) => ({
  role: one(roles, {
    fields: [roleMenus.roleId],
    references: [roles.id],
  }),
  menu: one(menus, {
    fields: [roleMenus.menuId],
    references: [menus.id],
  }),
}))

export const profileRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
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

export const portfolioRelations = relations(portfolios, ({ one }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id],
  }),
}))

export const awardRelations = relations(awards, ({ one }) => ({
  user: one(users, {
    fields: [awards.userId],
    references: [users.id],
  }),
}))
