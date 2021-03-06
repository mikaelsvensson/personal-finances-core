import SwedbankCsvTransactionReader from '../SwedbankCsvTransactionReader'

describe('SwedbankCsvTransactionReader', () => {
  const importer = new SwedbankCsvTransactionReader()

  test('should handle real file', async () => {
    const res = await importer.loadTransactionsFromFile('src/importer/__tests__/SwedbankCsvTransactionReader.csv')
    expect(res).toHaveLength(10)

    expect(res[0].text).toBe('Autogiro')
    expect(res[0].items[0].amount).toBe(-150000)
    expect(res[0].items[0].text).toBe('BUTIK')

    expect(res[8].text).toBe('Utdelning')
    expect(res[8].items[0].amount).toBe(8300)
    expect(res[8].items[0].text).toBe('Utd AKTIE')
  })
})
