import VirtualAccount from "./VirtualAccount";

class TransactionItem {
    constructor(public amount: number,
                public text: string,
                public virtualAccount: VirtualAccount) {

    }
}

export default TransactionItem
