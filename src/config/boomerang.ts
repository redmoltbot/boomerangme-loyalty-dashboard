export const BOOMERANG_CONFIG = {
  baseUrl: '',
  primaryCardId: import.meta.env.VITE_PRIMARY_CARD_ID as string,
  companyName: import.meta.env.VITE_COMPANY_NAME as string,
  rateLimit: { requestsPerSecond: 10 },
} as const
