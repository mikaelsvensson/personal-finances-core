import DataStore from '../core/dataaccess/DataStore'
import Transaction from '../core/Transaction'

class TransactionImporter {
  constructor(private store: DataStore) {}

  import(transactions: Transaction[]) {
    transactions.forEach((transaction: Transaction) => {
      if (transaction.sourceReference != null) {
        const existingTransaction = this.store.readTransactionBySourceReference(transaction.sourceReference)
        if (existingTransaction != null) {
          return
        }
      }

      let realAccount = transaction.realAccount?.sourceReference
        ? this.store.readRealAccountBySourceReference(transaction.realAccount.sourceReference)
        : null
      if (!realAccount && transaction.realAccount) {
        const newRealAccountId = this.store.createRealAccount(transaction.realAccount)
        realAccount = this.store.readRealAccount(newRealAccountId)
      }
      transaction.realAccount = realAccount

      this.store.createTransaction(transaction)
    })
  }
}

export default TransactionImporter
