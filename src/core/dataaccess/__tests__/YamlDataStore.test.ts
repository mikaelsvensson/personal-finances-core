import YamlDataStore from '../YamlDataStore'
import Transaction from '../../Transaction'
import TransactionItem from '../../TransactionItem'
import RealAccount from '../../RealAccount'
import VirtualAccount from '../../VirtualAccount'

describe('YamlDataStore', () => {
  test('readTransactionsAll', () => {
    const assertTransaction = (actual: Transaction, expectedDescription: string, expectedSum: number) => {
      expect(actual.description()).toEqual(expectedDescription)
      expect(actual.sum()).toEqual(expectedSum)
    }

    const store = new YamlDataStore().load('src/core/dataaccess/__tests__/YamlDataStore.simple.yaml')
    const actual = store.readTransactionsAll()

    expect(actual).toHaveLength(4)
    assertTransaction(actual[0], 'Ice Cream', 3000)
    assertTransaction(actual[1], 'Rent', 500000)
    assertTransaction(actual[2], 'Chair', 69900)
    assertTransaction(actual[3], 'Milk, Bananas, Light bulb', 7571)
    expect(actual[3].items[0].virtualAccount?.name).toEqual('Food')
    expect(actual[3].items[1].virtualAccount?.name).toEqual('Food')
    expect(actual[3].items[2].virtualAccount?.name).toEqual('Living')
  })
  test('createRealAccount, createVirtualAccount and createTransaction', () => {
    const store = new YamlDataStore()

    const realAccountId = store.createRealAccount(new RealAccount('My account', 'Big Bank', '123-456-789', null))

    const realAccount = store.readRealAccount(realAccountId)

    const virtualAccountId = store.createVirtualAccount(new VirtualAccount('Food', 100, null))

    const virtualAccount = store.readVirtualAccount(virtualAccountId)

    const transactionId = store.createTransaction(
      new Transaction(
        'Ice Cream',
        realAccount,
        new Date(),
        [new TransactionItem(2500, 'Scoops', virtualAccount, null), new TransactionItem(500, 'Sprinkles', null, null)],
        null
      )
    )

    const readTransaction = store.readTransaction(transactionId)

    expect(readTransaction?.id).toBeTruthy()
    expect(readTransaction?.realAccount?.name).toBeTruthy()
    expect(readTransaction?.items[0].virtualAccount?.name).toBeTruthy()

    store.save(`src/core/dataaccess/__tests__/YamlDataStore.createTransaction.${new Date().getTime()}.yaml`)
  })
})
