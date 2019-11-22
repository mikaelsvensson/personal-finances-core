import Importer from "./Importer";
import Transaction from "../core/Transaction";
import TransactionItem from "../core/TransactionItem";
import RealAccount from "../core/RealAccount";
import * as fs from 'fs';
import {default as csv} from 'csv-parse/lib/sync';
import * as joi from '@hapi/joi';

const amountSchema = joi.string().pattern(/^-?[0-9]+\.[0-9]{2}$/)

const amountParser = (input: string) => parseInt(input.replace('.', ''))

const rowSchema = joi.object({
    rowNumber: joi.number(),
    clearingNumber: joi.string(),
    accountNumber: joi.string(),
    bankProduct: joi.string(),
    currency: joi.string().length(3),
    bookingDate: joi.date(),
    transactionDate: joi.date(),
    currencyDate: joi.date(),
    reference: joi.string(),
    transactionType: joi.string(),
    amount: amountSchema,
    balanceAfter: amountSchema
})

class SwedbankCsvImporter implements Importer {
    loadTransactionsFromFile(path: string): Promise<Transaction[]> {
        const results: Transaction[] = [];

        const rawData: string = fs.readFileSync(path, {
            encoding: 'latin1'
        });

        const rows: object[] = csv(rawData, {
            from_line: 3,
            columns: [
                'rowNumber',
                'clearingNumber',
                'accountNumber',
                'bankProduct',
                'currency',
                'bookingDate',
                'transactionDate',
                'currencyDate',
                'reference',
                'transactionType',
                'amount',
                'balanceAfter'
            ]
        });
        return Promise.resolve(rows.map(data => {
            const {value, error} = rowSchema.validate(data)
            if (!error) {
                value.amount = amountParser(value.amount);
                value.balanceAfter = amountParser(value.balanceAfter);
                return value
            } else {
                return null
            }
        }).filter(data => {
            return !!data
        }).map(value => {
            return new Transaction(
                value.transactionType,
                new RealAccount(
                    `${value.clearingNumber} ${value.accountNumber}`,
                    'Swedbank',
                    `${value.clearingNumber} ${value.accountNumber}`,
                    null),
                value.transactionDate,
                [
                    new TransactionItem(
                        value.amount,
                        value.reference,
                        null,
                        null)
                ],
                null
            )
        }))
    }
}

export default SwedbankCsvImporter
