import { VerificationCode } from '@/types/verification'

export interface VerificationResponse {
  success: boolean
  message: string
  code?: VerificationCode
  error?: string
}

export interface GetAllCodesResponse {
  success: boolean
  totalCodes: number
  codes: VerificationCode[]
  error?: string
}

export const addVerificationCode = async (
  code: string, 
  email?: string
): Promise<VerificationResponse> => {
  try {
    const response = await fetch('/api/add-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        email,
        timestamp: new Date().toISOString(),
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error adding verification code:', error)
    return {
      success: false,
      message: 'Failed to add verification code',
      error: 'Failed to add verification code'
    }
  }
}

export const getVerificationCodes = async (): Promise<VerificationCode[]> => {
  try {
    const response = await fetch('/api/add-code', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return data.codes || []
  } catch (error) {
    console.error('Error getting verification codes:', error)
    return []
  }
}

export const getAllVerificationCodes = async (): Promise<GetAllCodesResponse> => {
  try {
    const response = await fetch('/api/get-all-codes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting all verification codes:', error)
    return {
      success: false,
      totalCodes: 0,
      codes: [],
      error: 'Failed to retrieve verification codes'
    }
  }
}
