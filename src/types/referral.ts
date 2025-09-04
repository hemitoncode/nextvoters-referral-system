export interface ReferralState {
  referralCode: string
  isGenerated: boolean
}

export interface ReferralActions {
  setReferralCode: (code: string) => void
  generateReferralCode: () => void
  reset: () => void
  getReferralCode: () => string
}

export type ReferralStore = ReferralState & ReferralActions
