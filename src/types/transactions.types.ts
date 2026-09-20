export interface TransactionItem {
  itemId: number
  name: string
  quantity: number
  unitCost: number
  unitPrice: number
}

export interface Transaction {
  id: string
  customerName: string
  date: string
  items: TransactionItem[]
}
