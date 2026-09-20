import type { TransactionItem } from '@/types/transactions.types'

export const calculateSubtotal = (items: TransactionItem[]): string => {
  let total: number = 0.0
  items.forEach((i) => (total += i.unitPrice * i.quantity))
  return total.toFixed(2)
}
