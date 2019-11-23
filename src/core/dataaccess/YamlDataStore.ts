import DataStore from './DataStore'
import Transaction from '../Transaction'
import yaml from 'js-yaml'
import * as fs from 'fs'
import VirtualAccount from '../VirtualAccount'
import RealAccount from '../RealAccount'
import TransactionItem from '../TransactionItem'
import * as uuid from 'uuid'

class YamlDataStore implements DataStore {
  private realAccounts: RealAccount[] = []
  private virtualAccounts: VirtualAccount[] = []
  private transactions: Transaction[] = []

  load(filePath: string): YamlDataStore {
    try {
      const doc = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'))

      this.realAccounts = doc.realAccounts.map(
        (obj: any) =>
          new RealAccount(obj.name, obj.finalcialInstitution, obj.accountNumber, obj.sourceReference, obj.id)
      )

      this.virtualAccounts = doc.virtualAccounts.map((obj: any) => new VirtualAccount(obj.name, obj.number, obj.id))

      this.transactions = doc.transactions.map(
        (obj: any) =>
          new Transaction(
            obj.name,
            this.realAccounts.find((realAccount: RealAccount) => realAccount.id == obj.realAccountId) || null,
            new Date(),
            obj.items.map(
              (itemObj: any) =>
                new TransactionItem(
                  itemObj.amount,
                  itemObj.name,
                  this.virtualAccounts.find(
                    (virtualAccount: VirtualAccount) => virtualAccount.id == itemObj.virtualAccountId
                  ) || null,
                  itemObj.id
                )
            ),
            obj.sourceReference,
            obj.id
          )
      )
    } catch (e) {
      console.log('💥', e)
    }

    return this
  }

  save(filePath: string) {
    const doc = {
      realAccounts: this.realAccounts,
      virtualAccounts: this.virtualAccounts,
      transactions: this.transactions.map((transaction: Transaction) => {
        const { realAccount, ...dumpedTransaction } = transaction
        return {
          ...dumpedTransaction,
          realAccountId: realAccount?.id || null,
          items: transaction.items.map((item: TransactionItem) => {
            const { virtualAccount, ...dumpedItem } = item
            return {
              ...dumpedItem,
              virtualAccountId: virtualAccount?.id || null
            }
          })
        }
      })
    }
    const dump = yaml.safeDump(doc, {
      lineWidth: 120
    })
    fs.writeFileSync(filePath, dump, {
      encoding: 'utf-8'
    })
  }

  readTransaction(id: string): Transaction | null {
    return this.transactions.find((transaction: Transaction) => transaction.id === id) || null
  }

  readTransactionBySourceReference(sourceReference: string): Transaction | null {
    return this.transactions.find((transaction: Transaction) => transaction.sourceReference === sourceReference) || null
  }

  readVirtualAccount(id: string): VirtualAccount | null {
    return this.virtualAccounts.find((virtualAccount: VirtualAccount) => virtualAccount.id === id) || null
  }

  readRealAccount(id: string): RealAccount | null {
    return this.realAccounts.find((realAccount: RealAccount) => realAccount.id === id) || null
  }

  readRealAccountBySourceReference(sourceReference: string): RealAccount | null {
    return this.realAccounts.find((realAccount: RealAccount) => realAccount.sourceReference === sourceReference) || null
  }

  readTransactionsAll(): Transaction[] {
    return this.transactions
  }

  createRealAccount(realAccount: RealAccount): string {
    realAccount.id = uuid.v4()
    this.realAccounts.push(realAccount)
    return realAccount.id
  }

  createVirtualAccount(virtualAccount: VirtualAccount): string {
    virtualAccount.id = uuid.v4()
    this.virtualAccounts.push(virtualAccount)
    return virtualAccount.id
  }

  createTransaction(transaction: Transaction): string {
    transaction.id = uuid.v4()
    this.transactions.push(transaction)
    return transaction.id
  }
}

export default YamlDataStore
