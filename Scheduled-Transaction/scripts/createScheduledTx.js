const {
    TransferTransaction,
    Client,
    ScheduleCreateTransaction,
    PrivateKey,
    Hbar,
    AccountId
} = require("@hashgraph/sdk");
require('dotenv').config();

const myAccountId = process.env.Account1_ID;
const myPrivateKey = PrivateKey.fromString(process.env.Account1_Key);

const otherAccountId = process.env.Account2_ID;

// If we weren't able to grab it, we should throw a new error
if (myAccountId == null ||
    myPrivateKey == null ) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(myAccountId, myPrivateKey);

const createScheduleTx = async () => {

    //Create a transaction to schedule
    const transaction = new TransferTransaction()
        .addHbarTransfer(AccountId.fromString(myAccountId), Hbar.fromTinybars(-10))
        .addHbarTransfer(AccountId.fromString(otherAccountId), Hbar.fromTinybars(10));

    //Schedule a transaction
    const transactionObj = new ScheduleCreateTransaction()
        .setScheduledTransaction(transaction)
        .setScheduleMemo("Scheduled TX!")
        .setAdminKey(myPrivateKey)
        .freezeWith(client);

    const transactionDTO1 = transactionObj.toBytes();
    const transactionDTO1Armoured =  Buffer.from(transactionDTO1).toString('base64');  
    return transactionDTO1Armoured;
}

const executeScheduleTx = async (base64Obj) => {

    const transactionRebuiltRaw1 = Buffer.from(base64Obj, 'base64');
    const transactionRebuilt1 = ScheduleCreateTransaction.fromBytes(transactionRebuiltRaw1);        
    const signedTransaction3 = await transactionRebuilt1.sign(myPrivateKey)

    const txResponse = await signedTransaction3.execute(client);        
    const receipt = await txResponse.getReceipt(client);        
    console.log(`TX ${txResponse.transactionId.toString()} status: ${receipt.status}`);

    //Get the schedule ID
    const scheduleId = receipt.scheduleId;
    console.log("The schedule ID is " +scheduleId);
    
}

async function main() {
    let schedule = await createScheduleTx();
    await executeScheduleTx(schedule);
    process.exit();
}

main()