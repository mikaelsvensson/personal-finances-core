import DataStore from "./DataStore";
import Transaction from "../Transaction";
import yaml from 'js-yaml'
import * as fs from "fs";
import VirtualAccount from "../VirtualAccount";
import RealAccount from "../RealAccount";
import TransactionItem from "../TransactionItem";

class YamlDataStore implements DataStore {
    private doc: any;

    constructor(filePath: string) {
        try {
            this.doc = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            console.log('💥', e)
        }
    }

    getTransactionsAll(): Transaction[] {
        const realAccounts: RealAccount[] = this.doc.realAccounts.map(
            (obj: any) => new RealAccount(
                obj.name,
                obj.finalcialInstitution,
                obj.accountNumber,
                obj.id))

        const virtualAccounts: VirtualAccount[] = this.doc.virtualAccounts.map(
            (obj: any) => new VirtualAccount(
                obj.name,
                obj.number,
                obj.id))

        return this.doc.transactions.map(
            (obj: any) => new Transaction(
                obj.name,
                realAccounts.find((realAccount: RealAccount) => realAccount.id == obj.realAccount) || null,
                new Date(),
                obj.items.map(
                    (itemObj: any) => new TransactionItem(
                        itemObj.amount,
                        itemObj.name,
                        virtualAccounts.find((virtualAccount: VirtualAccount) => virtualAccount.id == itemObj.virtualAccount) || null,
                        itemObj.id
                    )),
                obj.id
            ));
    }

}

export default YamlDataStore
