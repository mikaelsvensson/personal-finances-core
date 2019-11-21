import RealAccount from "./RealAccount";
import TransactionItem from "./TransactionItem";

class Transaction {
    constructor(public text: string,
                public realAccount: RealAccount,
                public date: Date,
                public items: TransactionItem[]) {

    }

    sum(): number {
        return this.items.reduce(function (sum: number, item: TransactionItem) {
            return sum + item.amount
        }, 0)
    }
}

export default Transaction
