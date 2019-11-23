import Transaction from '../core/Transaction'

interface TransactionReader {
  loadTransactionsFromFile(path: string): Promise<Transaction[]>
}

export default TransactionReader
