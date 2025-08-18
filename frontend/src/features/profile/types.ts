export type VerifyStep = 'start' | 'check-otp' | 'start-add-card' | 'save-card'

export type StartVerifyPayload = {
  step: 'start'
  email?: string
}

export type CheckOtpPayload = {
  step: 'check-otp'
  otp: string
}

export type StartAddCardPayload = {
  step: 'start-add-card'
}

export type SaveCardPayload = {
  step: 'save-card'
  payment_method_id: string
}

export type SetupIntentResponse = {
  client_secret: string
}

export type PaymentMethodSummary = {
  id: string
  brand?: string
  last4?: string
  exp_month?: number
  exp_year?: number
}


