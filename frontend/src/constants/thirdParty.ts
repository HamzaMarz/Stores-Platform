export const GOOGLE_CLIENT_ID: string = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || ''
export const GOOGLE_OAUTH_SCOPES = 'openid email profile'

// Support both STRIPE_PUBLISHABLE_KEY and VITE_STRIPE_PUBLISHABLE_KEY
export const STRIPE_PUBLISHABLE_KEY: string =
  ((import.meta.env as any).STRIPE_PUBLISHABLE_KEY as string) ||
  ((import.meta.env as any).VITE_STRIPE_PUBLISHABLE_KEY as string) ||
  ''

