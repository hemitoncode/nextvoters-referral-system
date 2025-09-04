import { create } from 'zustand'
import { ReferralState, ReferralStore } from '@/types/referral'

const initialState: ReferralState = {
  referralCode: '',
  isGenerated: false,
}

export const useReferralStore = create<ReferralStore>((set, get) => ({
  ...initialState,

  setReferralCode: (code: string) => {
    set({ referralCode: code, isGenerated: true })
  },

  generateReferralCode: () => {
    const code = 'NV' + Math.floor(1000 + Math.random() * 9999);
    set({ referralCode: code, isGenerated: true })
  },

  reset: () => {
    set(initialState)
  },

  getReferralCode: () => get().referralCode,
}))

export default useReferralStore
