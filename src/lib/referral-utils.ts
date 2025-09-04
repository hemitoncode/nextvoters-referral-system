import useReferralStore from "@/store/use-referral-store"

function generateReferralCode() {
  useReferralStore.getState().generateReferralCode()
}

function setReferralCode(code: string) {
  useReferralStore.getState().setReferralCode(code)
}

function getReferralCode(): string {
  return useReferralStore.getState().getReferralCode()
}

export { generateReferralCode, setReferralCode, getReferralCode }
