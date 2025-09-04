import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const CODES_FILE_PATH = path.join(process.cwd(), 'data', 'verification-codes.json')

// Read existing codes from JSON file
const readCodes = () => {
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

export async function GET() {
  try {
    const codesData = readCodes()
    
    return NextResponse.json({
      success: true,
      totalCodes: codesData.codes.length,
      codes: codesData.codes
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error getting all codes:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve verification codes',
        codes: []
      },
      { status: 500 }
    )
  }
}
