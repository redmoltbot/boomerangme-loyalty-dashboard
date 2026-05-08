export type CardType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  0: 'Stamp',
  1: 'Cashback',
  2: 'Multipass',
  3: 'Coupon',
  4: 'Discount',
  5: 'Gift',
  6: 'Membership',
  7: 'Reward',
}

export const GENDER_LABELS: Record<number, string> = {
  0: 'Not specified',
  1: 'Male',
  2: 'Female',
}

export interface CustomerSegment {
  id: number
  type: number
  name: string
}

export interface CustomField {
  id: number
  name: string
  type: string
  order: number
  value: string
  required: boolean
  unique: boolean
}

export interface MembershipTier {
  id: number
  templateId: number
  name: string
  description: string
  benefits?: string[]
}

export interface RewardTier {
  id: number
  templateId: number
  name: string
  type: number
  threshold: number
  value: number
  valueLimit: number
  usageLimit: number
}

export interface Customer {
  id: string
  phone?: string
  email?: string
  firstName?: string
  lastName?: string
  gender?: number
  dateOfBirth?: string
  segments?: CustomerSegment[]
  cards?: Card[]
  ltv?: number
  createdAt: string
  updatedAt?: string
}

export interface Card {
  id: string
  number: string
  templateId: number
  companyId?: number
  cardType: CardType
  customerId?: string
  device?: string
  stamps?: number
  maxStamps?: number
  rewards?: number
  points?: number
  amount?: number
  scores?: number
  visits?: number
  status: 'active' | 'inactive' | 'expired'
  createdAt: string
  updatedAt?: string
  expiresAt?: string
  customer?: Customer
  customFields?: CustomField[]
  membershipTier?: MembershipTier
  availableRewardTiers?: RewardTier[]
  installLink?: string
  shareLink?: string
  qrLink?: string
  countVisits?: number
  totalRewardsRedeemed?: number
  totalRewardsEarned?: number
  totalStampsEarnedByReferral?: number
  totalPointsEarnedByReferral?: number
  lastRewardRedeemedAt?: string
  lastRewardEarnedAt?: string
  lastStampEarnedAt?: string
  couponRedeemed?: boolean
  firstVisitDiscount?: string
}

export interface Operation {
  id: string
  cardNumber: string
  customerId?: string
  type: string
  value: number
  comment?: string
  createdAt: string
}

export interface Template {
  id: number
  name: string
  cardType: CardType
  companyId?: string
}

export interface PhoneLookupResult {
  found: boolean
  card?: Card
  customer?: Customer
  phone: string
}

export interface ApiError {
  status: number
  message: string
  isRateLimit: boolean
  retryAfter?: number
}

export interface CreateCardPayload {
  templateId: number
  phone?: string
  firstName?: string
  lastName?: string
  email?: string
}

export interface CreateCustomerPayload {
  phone?: string
  firstName?: string
  lastName?: string
  email?: string
}

export interface SendPushPayload {
  templateId: number
  title: string
  message: string
  url?: string
}

export interface CreatePromotionPayload {
  templateId: number
  name: string
  active?: boolean
}

export interface Promotion {
  id: string
  templateId: number
  name: string
  active: boolean
  createdAt: string
}
