import YamlDataStore from '../../core/dataaccess/YamlDataStore'
import TransactionImporter from '../TransactionImporter'
import SwedbankCsvTransactionReader from '../SwedbankCsvTransactionReader'

describe('TransactionImporter', () => {
  test('TransactionImporter', async () => {
    const store = new YamlDataStore()

    const transactions = await new SwedbankCsvTransactionReader().loadTransactionsFromFile(
      'src/importer/__tests__/SwedbankCsvTransactionReader.csv'
    )

    new TransactionImporter(store).import(transactions)

    // TODO: Don't save result to file
    store.save(`src/importer/__tests__/TransactionImporter.${new Date().getTime()}.yaml`)

    // TODO: Add assertions
  })
})
