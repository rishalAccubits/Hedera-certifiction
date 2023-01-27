const { Client, PrivateKey, AccountCreateTransaction, Hbar } = require('@hashgraph/sdk');
require('dotenv').config();

const { CLIENT_ID, CLIENT_PRIVATE_KEY } = process.env;

const main = async () => {
  //Create new keys
  console.log(`\nGenerating Key Pairs`);
  const keyPairs = await generateKeys(5);
  console.log(`\nAdding initial balance to accounts`);
  const generatedAccounts = await createAccounts(keyPairs);
  console.log(`\nGetting funded account IDs`);
  const accountIds = await getAccountIds(generatedAccounts);
  console.log(`\nCreated 5 accounts with 500 HBAR. Accounts are:`);
  // Get the new account ID
  accountIds.map(async (receipt, i) => {
    console.log(`\n\nAccount ${i + 1} ID: ${receipt.accountId.toString()}`);
    console.log(`Public Key: ${keyPairs.publicKeys[i].toStringRaw()}`);
    console.log(`Private Key: ${keyPairs.privateKeys[i].toStringRaw()}`);
  });
  process.exit();
};

const getClient = async () => {
  // If we weren't able to grab it, we should throw a new error
  if (CLIENT_ID == null || CLIENT_PRIVATE_KEY == null) {
    throw new Error(
      'Environment variables CLIENT_ID and CLIENT_PRIVATE_KEY must be present'
    );
  }

  // Create our connection to the Hedera network
  return Client.forTestnet().setOperator(CLIENT_ID, CLIENT_PRIVATE_KEY);
};

const generateKeys = async (numOfKeys) => {
  const privateKeys = [];
  const publicKeys = [];

  for (let i = 0; i < numOfKeys; i++) {
    const privateKey1 = PrivateKey.generateED25519();
    const publicKey1 = privateKey1.publicKey;
    privateKeys.push(privateKey1);
    publicKeys.push(publicKey1);
  }

  return { privateKeys, publicKeys };
};

const createAccounts = async (keyPairs) => {
  //Establishing client connection
  const client = await getClient();
  const promises = [];
  for (let i = 0; i < keyPairs.publicKeys.length; i++) {
    promises.push(
      new AccountCreateTransaction()
        .setKey(keyPairs.publicKeys[i])
        .setInitialBalance(Hbar.fromString('100'))
        .execute(client)
    );
  }
  return Promise.all(promises);
};

const getAccountIds = async (accCreateTxns) => {
  //Establishing client connection
  const client = await getClient();
  const promises = [];
  for (let i = 0; i < accCreateTxns.length; i++) {
    promises.push(accCreateTxns[i].getReceipt(client));
  }
  return Promise.all(promises);
};

main();
