#!/usr/bin/env node

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

interface EnvValidation {
  name: string
  required: boolean
  value?: string
  valid: boolean
  message?: string
}

const validations: EnvValidation[] = [
  {
    name: 'DATABASE_URL',
    required: false, // Temporarily not required for development
    value: process.env.DATABASE_URL,
    valid: !process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('postgresql://'),
    message: 'Must be a valid PostgreSQL connection string if provided'
  },
  {
    name: 'NEXTAUTH_URL',
    required: true,
    value: process.env.NEXTAUTH_URL,
    valid: !!process.env.NEXTAUTH_URL && (process.env.NEXTAUTH_URL.startsWith('http://') || process.env.NEXTAUTH_URL.startsWith('https://')),
    message: 'Must be a valid URL starting with http:// or https://'
  },
  {
    name: 'NEXTAUTH_SECRET',
    required: true,
    value: process.env.NEXTAUTH_SECRET,
    valid: !!process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length >= 32,
    message: 'Must be at least 32 characters long'
  },
  {
    name: 'GOOGLE_CLIENT_ID',
    required: true,
    value: process.env.GOOGLE_CLIENT_ID,
    valid: !!process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com'),
    message: 'Must be a valid Google OAuth client ID'
  },
  {
    name: 'GOOGLE_CLIENT_SECRET',
    required: true,
    value: process.env.GOOGLE_CLIENT_SECRET,
    valid: !!process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_SECRET.startsWith('GOCSPX-'),
    message: 'Must be a valid Google OAuth client secret'
  },
  {
    name: 'GOOGLE_SHEETS_PRIVATE_KEY',
    required: false,
    value: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    valid: !process.env.GOOGLE_SHEETS_PRIVATE_KEY || process.env.GOOGLE_SHEETS_PRIVATE_KEY.includes('-----BEGIN PRIVATE KEY-----'),
    message: 'Must be a valid private key if provided'
  },
  {
    name: 'GOOGLE_SHEETS_CLIENT_EMAIL',
    required: false,
    value: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    valid: !process.env.GOOGLE_SHEETS_CLIENT_EMAIL || process.env.GOOGLE_SHEETS_CLIENT_EMAIL.includes('@'),
    message: 'Must be a valid email if provided'
  },
  {
    name: 'GOOGLE_SHEETS_SPREADSHEET_ID',
    required: false,
    value: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    valid: !process.env.GOOGLE_SHEETS_SPREADSHEET_ID || process.env.GOOGLE_SHEETS_SPREADSHEET_ID.length > 0,
    message: 'Must be a valid spreadsheet ID if provided'
  }
]

function validateEnvironment() {
  console.log('🔍 Validating environment variables...\n')
  
  let hasErrors = false
  let hasWarnings = false

  validations.forEach(validation => {
    const status = validation.valid ? '✅' : validation.required ? '❌' : '⚠️'
    const required = validation.required ? '(Required)' : '(Optional)'
    
    console.log(`${status} ${validation.name} ${required}`)
    
    if (!validation.valid) {
      if (validation.required) {
        hasErrors = true
        console.log(`   Error: ${validation.message}`)
      } else {
        hasWarnings = true
        console.log(`   Warning: ${validation.message}`)
      }
    }
    
    if (validation.value && validation.name.includes('SECRET')) {
      console.log(`   Value: ${validation.value.substring(0, 8)}...`)
    } else if (validation.value) {
      console.log(`   Value: ${validation.value}`)
    } else {
      console.log(`   Value: Not set`)
    }
    console.log('')
  })

  // Check for production-specific requirements
  if (process.env.NODE_ENV === 'production') {
    console.log('🏭 Production Environment Checks:')
    
    if (!process.env.NEXTAUTH_URL?.startsWith('https://')) {
      hasErrors = true
      console.log('❌ NEXTAUTH_URL must use HTTPS in production')
    }
    
    if (process.env.NEXTAUTH_URL?.includes('localhost')) {
      hasErrors = true
      console.log('❌ NEXTAUTH_URL cannot contain localhost in production')
    }
    
    console.log('')
  }

  // Summary
  if (hasErrors) {
    console.log('❌ Environment validation failed! Please fix the required variables above.')
    process.exit(1)
  } else if (hasWarnings) {
    console.log('⚠️  Environment validation completed with warnings. Optional variables are not set.')
    console.log('✅ Application will run, but some features may be disabled.')
  } else {
    console.log('✅ Environment validation passed! All required variables are properly configured.')
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateEnvironment()
}

export { validateEnvironment }
