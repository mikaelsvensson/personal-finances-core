import Transaction from '../Transaction'
import RealAccount from '../RealAccount'
import VirtualAccount from '../VirtualAccount'

interface DataStore {
  //
  // Transactions
  //

  createTransaction(transaction: Transaction): string

  readTransaction(id: string): Transaction | null

  readTransactionBySourceReference(sourceReference: string): Transaction | null

  readTransactionsAll(): Transaction[]

  deleteTransaction(id: string): void

  //
  // Real accounts
  //
  createRealAccount(realAccount: RealAccount): string

  readRealAccount(id: string): RealAccount | null

  readRealAccountBySourceReference(sourceReference: string): RealAccount | null

  //
  // Virtual accounts
  //
  createVirtualAccount(virtualAccount: VirtualAccount): string

  readVirtualAccount(id: string): VirtualAccount | null
}

export default DataStore
