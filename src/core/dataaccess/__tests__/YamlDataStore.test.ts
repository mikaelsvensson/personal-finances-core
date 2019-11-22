import YamlDataStore from "../YamlDataStore";
import Transaction from "../../Transaction";

describe('YamlDataStore', () => {
    test('', () => {
        const assertTransaction = (actual: Transaction, expectedDescription: string, expectedSum: number) => {
            expect(actual.description()).toEqual(expectedDescription)
            expect(actual.sum()).toEqual(expectedSum)
        }

        const actual = new YamlDataStore('src/core/dataaccess/__tests__/YamlDataStore.simple.yaml').getTransactionsAll();

        expect(actual).toHaveLength(4)
        assertTransaction(actual[0], 'Ice Cream', 3000)
        assertTransaction(actual[1], 'Rent', 500000)
        assertTransaction(actual[2], 'Chair', 69900)
        assertTransaction(actual[3], 'Milk, Bananas, Light bulb', 7571)
        expect(actual[3].items[0].virtualAccount?.name).toEqual('Food')
        expect(actual[3].items[1].virtualAccount?.name).toEqual('Food')
        expect(actual[3].items[2].virtualAccount?.name).toEqual('Living')
    })
})
