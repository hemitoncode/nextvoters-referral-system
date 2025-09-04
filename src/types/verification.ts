export interface VerificationCode {
  code: string
  email: string | null
  timestamp: string
  used: boolean
}

export interface CodesData {
  codes: VerificationCode[]
}
