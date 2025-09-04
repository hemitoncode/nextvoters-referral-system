import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { VerificationCode } from '@/types/verification'

// Key namespace
const PREFIX = 'verification:'

// Check if code already exists
const isCodeDuplicate = async (code: string): Promise<boolean> => {
  const existing = await kv.get<VerificationCode>(`${PREFIX}${code}`)
  return !!existing
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

    // Check for duplicates
    if (await isCodeDuplicate(code)) {
      return NextResponse.json(
        { 
          error: 'Verification code already exists',
          code,
          message: 'This verification code conflicts with an existing entry'
        },
        { status: 409 }
      )
    }

    // New code object
    const newCode: VerificationCode = {
      code,
      email: email || null,
      timestamp: timestamp || new Date().toISOString(),
      used: false
    }

    // Save in KV
    await kv.set(`${PREFIX}${code}`, newCode)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Verification code added successfully',
        code: newCode
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // List all keys in this namespace
    const keys = await kv.keys(`${PREFIX}*`)

    // Fetch all codes
    const codes = await Promise.all(
      keys.map(key => kv.get<VerificationCode>(key))
    )

    return NextResponse.json({ codes: codes.filter(Boolean) }, { status: 200 })
  } catch (error) {
    console.error('Error reading codes:', error)
    return NextResponse.json(
      { error: 'Failed to read verification codes' },
      { status: 500 }
    )
  }
}
