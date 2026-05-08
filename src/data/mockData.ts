import type { Customer, Card, Operation } from '../types/boomerang'

export const mockCustomers: Customer[] = [
  { id: 'c001', firstName: 'Mei', lastName: 'Tan', phone: '+6591234567', email: 'mei.tan@email.com', ltv: 240, createdAt: '2024-03-15T08:00:00Z' },
  { id: 'c002', firstName: 'Wei', lastName: 'Lim', phone: '+6598765432', email: 'wei.lim@email.com', ltv: 180, createdAt: '2024-04-02T10:30:00Z' },
  { id: 'c003', firstName: 'Siti', lastName: 'Binte Rahmat', phone: '+6587654321', email: 'siti@email.com', ltv: 95, createdAt: '2024-05-20T14:15:00Z' },
  { id: 'c004', firstName: 'Raj', lastName: 'Kumar', phone: '+6592345678', email: 'raj.k@email.com', ltv: 320, createdAt: '2024-01-10T09:00:00Z' },
  { id: 'c005', firstName: 'Li', lastName: 'Xiao', phone: '+6511223344', email: '', ltv: 60, createdAt: '2024-07-01T11:00:00Z' },
]

export const mockCards: Card[] = [
  { id: 'k001', number: 'BK-001234', templateId: 965363, cardType: 0, customerId: 'c001', stamps: 7, maxStamps: 10, rewards: 1, status: 'active', createdAt: '2024-03-15T08:05:00Z' },
  { id: 'k002', number: 'BK-002345', templateId: 965363, cardType: 0, customerId: 'c002', stamps: 3, maxStamps: 10, rewards: 0, status: 'active', createdAt: '2024-04-02T10:35:00Z' },
  { id: 'k003', number: 'BK-003456', templateId: 965363, cardType: 0, customerId: 'c003', stamps: 10, maxStamps: 10, rewards: 2, status: 'active', createdAt: '2024-05-20T14:20:00Z' },
  { id: 'k004', number: 'BK-004567', templateId: 965363, cardType: 0, customerId: 'c004', stamps: 1, maxStamps: 10, rewards: 3, status: 'active', createdAt: '2024-01-10T09:05:00Z' },
  { id: 'k005', number: 'BK-005678', templateId: 965363, cardType: 0, customerId: 'c005', stamps: 0, maxStamps: 10, rewards: 0, status: 'inactive', createdAt: '2024-07-01T11:05:00Z' },
]

export const mockOperations: Operation[] = [
  { id: 'op001', cardNumber: 'BK-001234', customerId: 'c001', type: 'stamp_add', value: 1, comment: 'Purchase stamp', createdAt: '2024-07-30T09:15:00Z' },
  { id: 'op002', cardNumber: 'BK-001234', customerId: 'c001', type: 'reward_add', value: 1, comment: 'Reward earned', createdAt: '2024-07-28T11:30:00Z' },
  { id: 'op003', cardNumber: 'BK-003456', customerId: 'c003', type: 'reward_redeem', value: -1, comment: 'Free croissant', createdAt: '2024-07-25T14:00:00Z' },
  { id: 'op004', cardNumber: 'BK-002345', customerId: 'c002', type: 'stamp_add', value: 1, comment: 'Purchase stamp', createdAt: '2024-07-20T08:45:00Z' },
  { id: 'op005', cardNumber: 'BK-004567', customerId: 'c004', type: 'stamp_add', value: 1, comment: 'Weekend purchase', createdAt: '2024-07-15T16:20:00Z' },
]
