import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates if a string is a valid email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Processes a string containing one or more comma-separated email addresses.
 * Returns an object with valid emails, invalid emails, and duplicate emails.
 */
export interface ProcessEmailsResult {
  valid: string[]
  invalid: string[]
  duplicates: string[]
}

export function processMultipleEmails(
  value: string,
  existingEmails: string[] = [],
): ProcessEmailsResult {
  // Split by comma and process each email
  const emailValues = value
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0)

  const result: ProcessEmailsResult = {
    valid: [],
    invalid: [],
    duplicates: [],
  }

  const existingSet = new Set(existingEmails.map((e) => e.toLowerCase()))

  emailValues.forEach((emailValue) => {
    const trimmedEmail = emailValue.trim().toLowerCase()

    // Check for duplicates
    if (existingSet.has(trimmedEmail)) {
      result.duplicates.push(trimmedEmail)
      return
    }

    // Validate email format
    if (isValidEmail(trimmedEmail)) {
      result.valid.push(trimmedEmail)
      existingSet.add(trimmedEmail) // Track to avoid duplicates within the same batch
    } else {
      result.invalid.push(trimmedEmail)
    }
  })

  return result
}

