import VirtualAccount from "./VirtualAccount";

class TransactionItem {
    constructor(public amount: number,
                public text: string,
                public virtualAccount: VirtualAccount | null,
                public id: string | null) {

    }
}

export default TransactionItem
