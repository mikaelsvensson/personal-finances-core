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

    const realAccountId = store.createRealAccount(new RealAccount('My account', 'Big Bank', '123-456-789', null, null))

    const realAccount = store.readRealAccount(realAccountId)

    const virtualAccountId = store.createVirtualAccount(new VirtualAccount('Food', 100, null))

    const virtualAccount = store.readVirtualAccount(virtualAccountId)

    const transactionId = store.createTransaction(
      new Transaction(
        'Ice Cream',
        realAccount,
        new Date(),
        [new TransactionItem(2500, 'Scoops', virtualAccount, null), new TransactionItem(500, 'Sprinkles', null, null)],
        null,
        null
      )
    )

    const readTransaction = store.readTransaction(transactionId)

    expect(readTransaction?.id).toBeTruthy()
    expect(readTransaction?.realAccount?.name).toBeTruthy()
    expect(readTransaction?.items[0].virtualAccount?.name).toBeTruthy()

    // TODO: Don't save result to file
    store.save(`src/core/dataaccess/__tests__/YamlDataStore.createTransaction.${new Date().getTime()}.yaml`)
  })

  test('save and load', () => {
    const saveStore = new YamlDataStore()

    const realAccountId = saveStore.createRealAccount(new RealAccount('My account', 'Big Bank', '123-456-789', null, null))

    const realAccount = saveStore.readRealAccount(realAccountId)

    const virtualAccountId = saveStore.createVirtualAccount(new VirtualAccount('Food', 100, null))

    const virtualAccount = saveStore.readVirtualAccount(virtualAccountId)

    const transactionId = saveStore.createTransaction(
      new Transaction(
        'Ice Cream',
        realAccount,
        new Date(),
        [new TransactionItem(2500, 'Scoops', virtualAccount, null), new TransactionItem(500, 'Sprinkles', null, null)],
        null,
        null
      )
    )

    // TODO: Don't save result to file
    const path = `src/core/dataaccess/__tests__/YamlDataStore.saveAndLoad.${new Date().getTime()}.yaml`
    saveStore.save(path)

    const verifyStore = new YamlDataStore()
    verifyStore.load(path)

    const verifyTransaction = verifyStore.readTransaction(transactionId)

    expect(verifyTransaction?.id).toBeTruthy()
    expect(verifyTransaction?.realAccount?.name).toBe('My account')
    expect(verifyTransaction?.realAccount?.accountNumber).toBe('123-456-789')
    expect(verifyTransaction?.realAccount?.financialInstitution).toBe('Big Bank')
    expect(verifyTransaction?.realAccount?.sourceReference).toBeFalsy()
    expect(verifyTransaction?.text).toBe('Ice Cream')
    expect(verifyTransaction?.items[0].text).toBe('Scoops')
    expect(verifyTransaction?.items[0].amount).toBe(2500)
    expect(verifyTransaction?.items[0].virtualAccount?.name).toBe('Food')
    expect(verifyTransaction?.items[0].virtualAccount?.code).toBe(100)
    expect(verifyTransaction?.items[1].text).toBe('Sprinkles')
    expect(verifyTransaction?.items[1].amount).toBe(500)
    expect(verifyTransaction?.items[1].virtualAccount).toBeFalsy()
  })

  describe('delete', () => {
    test('existing transaction', () => {
      const store = new YamlDataStore().load('src/core/dataaccess/__tests__/YamlDataStore.simple.yaml')
      const idsBefore = store.readTransactionsAll().map((transaction: Transaction) => transaction.id)
      expect(idsBefore).toContain('Too0chae')

      store.deleteTransaction('Too0chae')

      const trans2 = store.readTransaction('Too0chae')
      expect(trans2).toBeFalsy()

      const idsAfter = store.readTransactionsAll().map((transaction: Transaction) => transaction.id)
      expect(idsAfter).not.toContain('Too0chae')
      expect(idsAfter).toHaveLength(idsBefore.length - 1)
    })

    test('missing transaction', () => {
      const store = new YamlDataStore().load('src/core/dataaccess/__tests__/YamlDataStore.simple.yaml')
      const idsBefore = store.readTransactionsAll().map((transaction: Transaction) => transaction.id)
      expect(idsBefore).not.toContain('missing')

      try {
        store.deleteTransaction('missing')
        fail('Should have failed')
      } catch (e) {
        // Expected
        const idsAfter = store.readTransactionsAll().map((transaction: Transaction) => transaction.id)
        expect(idsAfter).not.toContain('missing')
        expect(idsAfter).toHaveLength(idsBefore.length)
      }
    })
  })

  describe('delete virtual account', () => {
    test('existing transaction', () => {
      const store = new YamlDataStore().load('src/core/dataaccess/__tests__/YamlDataStore.simple.yaml')
      const idsBefore = store.readVirtualAccountsAll().map((account: VirtualAccount) => account.id)
      expect(idsBefore).toContain('oht4OoGh')

      store.deleteVirtualAccount('oht4OoGh')

      const trans2 = store.readVirtualAccount('oht4OoGh')
      expect(trans2).toBeFalsy()

      const idsAfter = store.readVirtualAccountsAll().map((account: VirtualAccount) => account.id)
      expect(idsAfter).not.toContain('oht4OoGh')
      expect(idsAfter).toHaveLength(idsBefore.length - 1)
    })

    test('missing transaction', () => {
      const store = new YamlDataStore().load('src/core/dataaccess/__tests__/YamlDataStore.simple.yaml')
      const idsBefore = store.readVirtualAccountsAll().map((account: VirtualAccount) => account.id)
      expect(idsBefore).not.toContain('missing')

      try {
        store.deleteVirtualAccount('missing')
        fail('Should have failed')
      } catch (e) {
        // Expected
        const idsAfter = store.readVirtualAccountsAll().map((account: VirtualAccount) => account.id)
        expect(idsAfter).not.toContain('missing')
        expect(idsAfter).toHaveLength(idsBefore.length)
      }
    })

  })
})
