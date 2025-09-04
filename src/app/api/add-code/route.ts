import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'
import { VerificationCode } from '@/types/verification'

const BLOB_NAME = 'verification-codes.json'

// Fetch current codes (or empty array if none exist yet)
const fetchCodes = async (): Promise<VerificationCode[]> => {
  const { blobs } = await list()
  const file = blobs.find(b => b.pathname === BLOB_NAME)

  if (!file) return []

  const res = await fetch(file.url)
  return res.ok ? ((await res.json()) as VerificationCode[]) : []
}

// Save codes back to Blob
const saveCodes = async (codes: VerificationCode[]) => {
  await put(BLOB_NAME, JSON.stringify(codes, null, 2), {
    contentType: 'application/json',
    access: 'public', // optional, you can make it private
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, email, timestamp } = body

    if (!code) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 })
    }

    const codes = await fetchCodes()

    if (codes.find(c => c.code === code)) {
      return NextResponse.json(
        {
          error: 'Verification code already exists',
          code,
          message: 'This verification code conflicts with an existing entry',
        },
        { status: 409 }
      )
    }

    const newCode: VerificationCode = {
      code,
      email: email || null,
      timestamp: timestamp || new Date().toISOString(),
      used: false,
    }

    codes.push(newCode)
    await saveCodes(codes)

    return NextResponse.json(
      {
        success: true,
        message: 'Verification code added successfully',
        code: newCode,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const codes = await fetchCodes()
    return NextResponse.json({ codes }, { status: 200 })
  } catch (error) {
    console.error('Error reading codes:', error)
    return NextResponse.json({ error: 'Failed to read verification codes' }, { status: 500 })
  }
}
