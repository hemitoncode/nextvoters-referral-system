import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { VerificationCode, CodesData } from '@/types/verification'

const CODES_FILE_PATH = path.join(process.cwd(), 'data', 'verification-codes.json')

// Ensure the data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(CODES_FILE_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read existing codes from JSON file
const readCodes = (): CodesData => {
  try {
    if (fs.existsSync(CODES_FILE_PATH)) {
      const data = fs.readFileSync(CODES_FILE_PATH, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading codes file:', error)
  }
  return { codes: [] }
}

// Write codes to JSON file
const writeCodes = (codes: CodesData): boolean => {
  try {
    ensureDataDirectory()
    fs.writeFileSync(CODES_FILE_PATH, JSON.stringify(codes, null, 2))
    return true
  } catch (error) {
    console.error('Error writing codes file:', error)
    return false
  }
}

// Check if code already exists
const isCodeDuplicate = (codes: VerificationCode[], newCode: string): boolean => {
  return codes.some(existingCode => existingCode.code === newCode)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, email, timestamp } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      )
    }

    // Read existing codes
    const codesData = readCodes()
    
    // Check for conflicts/duplicates
    if (isCodeDuplicate(codesData.codes, code)) {
      return NextResponse.json(
        { 
          error: 'Verification code already exists',
          code: code,
          message: 'This verification code conflicts with an existing entry'
        },
        { status: 409 }
      )
    }
    
    // Add new code with metadata
    const newCode = {
      code,
      email: email || null,
      timestamp: timestamp || new Date().toISOString(),
      used: false
    }

    codesData.codes.push(newCode)

    // Write back to file
    const success = writeCodes(codesData)

    if (success) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Verification code added successfully',
          code: newCode
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Failed to save verification code' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in add-code API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const codesData = readCodes()
    return NextResponse.json(codesData, { status: 200 })
  } catch (error) {
    console.error('Error reading codes:', error)
    return NextResponse.json(
      { error: 'Failed to read verification codes' },
      { status: 500 }
    )
  }
}
