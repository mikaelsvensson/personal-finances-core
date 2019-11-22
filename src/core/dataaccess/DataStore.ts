import Transaction from "../Transaction";

interface DataStore {
    getTransactionsAll(): Transaction[]
}

export default DataStore
