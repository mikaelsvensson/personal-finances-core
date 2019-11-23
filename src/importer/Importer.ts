import Transaction from '../core/Transaction'

interface Importer {
  loadTransactionsFromFile(path: string): Promise<Transaction[]>
}

export default Importer
