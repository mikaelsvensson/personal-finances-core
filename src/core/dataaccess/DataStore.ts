import Transaction from "../Transaction";
import RealAccount from "../RealAccount";
import VirtualAccount from "../VirtualAccount";

interface DataStore {
    createTransaction(transaction: Transaction): string

    readTransaction(id: string): Transaction | null

    readTransactionsAll(): Transaction[]

    createRealAccount(realAccount: RealAccount): string

    readRealAccount(id: string): RealAccount | null

    createVirtualAccount(virtualAccount: VirtualAccount): string

    readVirtualAccount(id: string): VirtualAccount | null
}

export default DataStore
