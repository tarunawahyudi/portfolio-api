/**
 * --- STRING MANIPULATION UTILITIES ---
 */

/**
 * Converts a string to camelCase format.
 *
 * @example
 * ```typescript
 * toCamelCase("hello-world") // -> "helloWorld"
 * toCamelCase("a_simple_title") // -> "aSimpleTitle"
 * ```
 * @param str The input string to convert.
 * @returns The string in camelCase format.
 */
export const toCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  })
}

/**
 * Converts a string to PascalCase format.
 *
 * @example
 * ```typescript
 * toPascalCase("hello-world") // -> "HelloWorld"
 * toPascalCase("a simple title") // -> "ASimpleTitle"
 * ```
 * @param str The input string to convert.
 * @returns The string in PascalCase format.
 */
export const toPascalCase = (str: string): string => {
  const camelCase = toCamelCase(str)
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
}

/**
 * --- NUMERIC AND CURRENCY UTILITIES ---
 */

/**
 * Formats a number as Indonesian Rupiah (IDR) currency string.
 * This utility uses the built-in `Intl.NumberFormat` for robust localization.
 *
 * @example
 * ```typescript
 * formatRupiah(1500000) // -> "Rp 1.500.000"
 * formatRupiah(25000) // -> "Rp 25.000"
 * ```
 * @param number The number to format.
 * @returns The formatted currency string.
 */
export const formatRupiah = (number: number): string => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  })
  return formatter.format(number)
}

/**
 * Formats a number with a thousand separators.
 *
 * @example
 * ```typescript
 * formatNumberWithCommas(1234567) // -> "1,234,567"
 * formatNumberWithCommas(98765) // -> "98,765"
 * ```
 * @param number The number to format.
 * @returns The formatted number string with commas.
 */
export const formatNumberWithCommas = (number: number): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * --- DATE AND TIME UTILITIES ---
 */

/**
 * Formats a `Date` object into a `YYYY-MM-DD` string.
 *
 * @example
 * ```typescript
 * const today = new Date();
 * formatDate(today) // -> "2025-08-14" (assuming today is Aug 14, 2025)
 * ```
 * @param date The `Date` object to format.
 * @returns The date string in `YYYY-MM-DD` format.
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parses a `YYYY-MM-DD` string into a `Date` object.
 *
 * @example
 * ```typescript
 * parseDate("2023-10-27") // -> Returns a Date object for Oct 27, 2023
 * ```
 * @param dateString The date string in `YYYY-MM-DD` format.
 * @returns A `Date` object corresponding to the input string.
 */
export const parseDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * --- VALIDATION UTILITIES ---
 */

/**
 * Checks if a string is a valid email address format.
 *
 * @example
 * ```typescript
 * isValidEmail("test@example.com") // -> true
 * isValidEmail("not-an-email") // -> false
 * ```
 * @param email The string to validate.
 * @returns `true` if the string is a valid email, otherwise `false`.
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Checks if a string is a valid URL.
 *
 * @example
 * ```typescript
 * isValidUrl("[https://www.google.com](https://www.google.com)") // -> true
 * isValidUrl("not-a-url") // -> false
 * ```
 * @param url The string to validate.
 * @returns `true` if the string is a valid URL, otherwise `false`.
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 * --- SECURITY UTILITIES (HASHING, ENCODING, ETC) ---
 *
 * Note: For production-grade security, it's highly recommended to use well-established
 * libraries like `bcrypt` for password hashing and the built-in `crypto` module.
 * These examples provide a basic demonstration.
 */

import { createHash } from 'crypto'

/**
 * Hashes a string using the SHA-256 algorithm.
 *
 * @example
 * ```typescript
 * hashData("my-secret-password") // -> "dd047c6a256f8f53c153725f46258c74e892d5445..."
 * ```
 * @param data The string to hash.
 * @returns The SHA-256 hash as a hexadecimal string.
 */
export const hashData = (data: string): string => {
  return createHash('sha256').update(data).digest('hex')
}

/**
 * Generates a random, cryptographically secure token of a specified length.
 * Ideal for generating verification tokens, API keys, or reset tokens.
 *
 * @example
 * ```typescript
 * generateRandomToken() // -> "G9f8h2jL1kM5nB3p7sT8vW4xY2z9c6dE..." (32 characters by default)
 * generateRandomToken(16) // -> "aB7cD8eF9gH1iJ2k"
 * ```
 * @param length The desired length of the token (default: 32).
 * @returns The randomly generated token string.
 */
export const generateRandomToken = (length: number = 32): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

/**
 * --- ARRAY AND OBJECT UTILITIES ---
 */

/**
 * Shuffles the elements of an array randomly.
 * This is an in-place shuffle that returns the modified array.
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * shuffleArray(numbers) // -> [3, 1, 5, 2, 4] (or some other random order)
 * ```
 * @template T The type of the array elements.
 * @param array The array to shuffle.
 * @returns The shuffled array.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

/**
 * Retrieves a property from an object, returning a default value if the property is undefined.
 * This is useful for safely accessing properties that might not exist.
 *
 * @example
 * ```typescript
 * const user = { name: "Alice" };
 * getPropertyOrDefault(user, "name", "Anonymous") // -> "Alice"
 * getPropertyOrDefault(user, "age", 30) // -> 30
 * ```
 * @template T The type of the object.
 * @template K The key of the property.
 * @param obj The object to query.
 * @param key The key of the property to retrieve.
 * @param defaultValue The value to return if the property is undefined.
 * @returns The value of the property or the default value.
 */
export const getPropertyOrDefault = <T, K extends keyof T>(obj: T, key: K, defaultValue: T[K]): T[K] => {
  return obj[key] !== undefined ? obj[key] : defaultValue
}

/**
 * --- OTHER COMMON UTILITIES ---
 */

/**
 * Generates a Universally Unique Identifier (UUID) version 4.
 *
 * @example
 * ```typescript
 * generateUUID() // -> "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 * ```
 * @returns A new UUID v4 string.
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * A utility function to asynchronously pause execution for a specified amount of time.
 * Useful for introducing delays in async functions.
 *
 * @example
 * ```typescript
 * console.log("Starting...");
 * await sleep(2000); // Pauses for 2 seconds
 * console.log("Done!");
 * ```
 * @param ms The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified time.
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Formats the duration between now and a future date (e.g., lockUntil)
 * into a human-readable string like "14 minutes 20 seconds".
 *
 * If the target time is in the past, it will return "Lock has expired".
 *
 * @example
 * ```typescript
 * getReadableLockDuration(new Date(Date.now() + 900000)) // -> "15 minutes"
 * ```
 * @param futureTime A future Date object (e.g., `lockUntil`)
 * @returns A formatted string like "14 minutes 30 seconds"
 */
export const getReadableLockDuration = (futureTime: Date): string => {
  const now = new Date()
  const diffMs = futureTime.getTime() - now.getTime()

  if (diffMs <= 0) return 'Lock has expired'

  const totalSeconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const parts: string[] = []

  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
  }

  if (seconds > 0) {
    parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`)
  }

  return parts.join(' ')
}

/**
 * Converts a relative storage path (e.g., from a database) into a full, absolute CDN or public URL.
 * It safely handles null or undefined paths and ensures the base URL is configured.
 *
 * @example
 * ```typescript
 * // Assuming process.env.R2_PUBLIC_URL = "[https://cdn.example.com](https://cdn.example.com)"
 * cdnUrl("avatars/user123.jpg") // -> "[https://cdn.example.com/avatars/user123.jpg](https://cdn.example.com/avatars/user123.jpg)"
 * cdnUrl(null) // -> null
 * ```
 * @param relativePath The relative path of the asset (e.g., 'avatars/xyz.jpg').
 * @returns The full public URL for the asset, or `null` if the input path is empty or the base URL is not configured.
 */
export const generateCdnUrl = (relativePath: string | null | undefined): string | null => {
  if (!relativePath) {
    return null
  }

  const baseUrl = process.env.R2_PUBLIC_URL ?? process.env.CDN_PUBLIC_URL

  if (!baseUrl) {
    console.error('CDN_PUBLIC_URL or R2_PUBLIC_URL is not defined in environment variables.')
    return null
  }

  return `${baseUrl}/${relativePath}`
}

/**
 * Generate a future Date by adding a number of minutes to the current time.
 *
 * This function is useful for generating expiration times such as
 * verification tokens, password reset links, or session lifetimes.
 *
 * @param minutes - The number of minutes to add from the current time.
 *                  Accepts positive integers for future time,
 *                  or negative integers to get a pastime.
 *
 * @returns A Date object representing the future (or past) time
 */
export function addMinutes(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000)
}
