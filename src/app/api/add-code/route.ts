import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'
import { VerificationCode } from '@/types/verification'

const BLOB_NAME = 'verification-codes.json'

// Fetch codes (or empty list if none exist)
const fetchCodes = async (): Promise<VerificationCode[]> => {
  const { blobs } = await list()
  const file = blobs.find(b => b.pathname === BLOB_NAME)
  if (!file) return []

  const res = await fetch(file.url)
  return res.ok ? (await res.json()) as VerificationCode[] : []
}

// Save codes back to Blob
const saveCodes = async (codes: VerificationCode[]) => {
  await put(BLOB_NAME, JSON.stringify(codes, null, 2), {
    contentType: 'application/json',
    access: 'public',
    allowOverwrite: true,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { code, email, timestamp } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 })
    }

    if (email && typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const codes = await fetchCodes()

    if (codes.some(c => c.code === code)) {
      return NextResponse.json(
        { error: 'Verification code already exists', code },
        { status: 409 }
      )
    }

    const newCode: VerificationCode = {
      code,
      email: email || null,
      timestamp: timestamp || new Date().toISOString(),
      used: false,
    }

    await saveCodes([...codes, newCode])

    return NextResponse.json(
      { success: true, message: 'Verification code added successfully', code: newCode },
      { status: 201 }
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
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Failed to read verification codes' }, { status: 500 })
  }
}
