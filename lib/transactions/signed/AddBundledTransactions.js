"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBundledTransactions = void 0;
const SignedTransaction_1 = require("./SignedTransaction");
const constants_1 = require("../../utils/constants");
const validation_1 = require("../../utils/validation");
class AddBundledTransactions extends SignedTransaction_1.SignedTransaction {
    constructor(fioAddress, bundleSets, maxFee, technologyProviderId = '') {
        super();
        this.ENDPOINT = 'chain/add_bundled_transactions';
        this.ACTION = 'addbundles';
        this.ACCOUNT = constants_1.Constants.defaultAccount;
        this.fioAddress = fioAddress;
        this.bundleSets = bundleSets;
        this.maxFee = maxFee;
        this.technologyProviderId = technologyProviderId;
        this.validationData = { fioAddress, tpid: technologyProviderId || null };
        this.validationRules = validation_1.validationRules.registerFioAddress;
    }
    getData() {
        const actor = this.getActor();
        const data = {
            fio_address: this.fioAddress,
            bundleSets,
            actor,
            tpid: this.technologyProviderId,
            max_fee: this.maxFee,
        };
        return data;
    }
}
exports.AddBundledTransactions = AddBundledTransactions;