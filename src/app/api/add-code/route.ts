import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { code, email, timestamp } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 })
    }

    if (email && typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('verification_codes')
      .insert([
        {
          code,
          email: email || null,
          timestamp: timestamp || new Date().toISOString(),
          used: false,
        },
      ])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // unique violation
        return NextResponse.json({ error: 'Verification code already exists', code }, { status: 409 })
      }
      console.error('Insert error:', error)
      return NextResponse.json({ error: 'Failed to add code' }, { status: 500 })
    }

    return NextResponse.json(
      { success: true, message: 'Verification code added successfully', code: data },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase.from('verification_codes').select('*')

    if (error) {
      console.error('GET error:', error)
      return NextResponse.json({ error: 'Failed to fetch codes' }, { status: 500 })
    }

    return NextResponse.json({ codes: data }, { status: 200 })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
