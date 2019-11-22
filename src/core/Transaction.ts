import RealAccount from "./RealAccount";
import TransactionItem from "./TransactionItem";

class Transaction {
    constructor(public text: string,
                public realAccount: RealAccount | null,
                public date: Date,
                public items: TransactionItem[],
                public id: string | null) {

    }

    sum(): number {
        return this.items.reduce(function (sum: number, item: TransactionItem) {
            return sum + item.amount
        }, 0)
    }

    description(): string {
        return this.text || this.items.map(function (item: TransactionItem) {
            return item.text
        }).join(', ')
    }
}

export default Transaction
