// EP-07 – Credit Account Management Types

export type CreditOwnerType = 'individual' | 'company'
export type CreditAccountStatus = 'active' | 'suspended' | 'closed'
export type CreditTransactionType = 'top_up' | 'bonus' | 'payment' | 'refund' | 'adjustment'
export type CreditPaymentMethod = 'vnpay' | 'momo' | 'zalopay' | 'cash' | 'system'
export type CampaignStatus = 'draft' | 'active' | 'completed' | 'cancelled'

export interface CreditAccount {
  id: string
  accountCode: string           // "CA-CUS-0001" | "CA-COM-0001"
  ownerType: CreditOwnerType
  customerId: string
  customerName: string

  // Balance
  currentBalance: number        // credits hiện có
  totalTopUp: number            // tổng đã nạp (không tính bonus)
  totalBonus: number            // tổng bonus đã nhận
  totalSpent: number            // tổng đã dùng

  // Alert
  lowBalanceThreshold: number   // ngưỡng cảnh báo

  status: CreditAccountStatus
  createdAt: string
  updatedAt: string
}

export interface CreditTransaction {
  id: string
  creditAccountId: string
  accountCode: string
  customerName: string

  type: CreditTransactionType
  amount: number                // dương: vào, âm: ra
  balanceBefore: number
  balanceAfter: number

  // Bonus metadata
  bonusReason?: string
  bonusCampaignId?: string

  // Employee tracking (company accounts)
  employeeId?: string
  employeeName?: string

  // Reference
  referenceType?: 'invoice' | 'booking' | 'service' | 'campaign'
  referenceCode?: string

  // Payment gateway (top_up online)
  paymentMethod?: CreditPaymentMethod
  paymentTransactionId?: string

  description: string
  createdBy: string
  createdAt: string
}

export interface BonusCreditCampaign {
  id: string
  campaignCode: string          // "CAMP-202604-001"
  name: string
  description?: string

  targetType: 'all' | 'individual' | 'company' | 'specific'
  targetCustomerIds?: string[]

  bonusCredits: number
  startDate: string
  endDate?: string
  creditExpiryDays?: number

  status: CampaignStatus
  totalIssued: number           // tổng credits đã phát

  createdBy: string
  createdAt: string
}
