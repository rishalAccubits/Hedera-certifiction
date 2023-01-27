const {
    Client,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
    TopicMessageQuery,
  } = require('@hashgraph/sdk');
  require('dotenv').config();
  
  //Grab your Hedera testnet account ID and private key from your .env file
  const { Account1_KEY, Account1_ID } = process.env;
  
  const main = async () => {
    // create a new topic to submit message
    const topicId = await createTopic();
  
    await new Promise((resolve) => setTimeout(resolve, 5000));
  
    await subscribeTopic(topicId.toString());
  
    // calculate current time
    const currentTime = new Date().toUTCString();
  
    // submit msg
    await submitMsg(topicId, currentTime);
  };
  
  const createTopic = async () => {
    const client = await getClient();
  
    //Create a new topic
    let txResponse = await new TopicCreateTransaction().execute(client);
  
    //Get the receipt of the transaction
    let receipt = await txResponse.getReceipt(client);
  
    console.log(`Topic ${receipt.topicId} created`);
  
    //Grab the new topic ID from the receipt
    return receipt.topicId;
  };
  
  const subscribeTopic = async (topicId) => {
    const client = await getClient();
  
    //Create the query to subscribe to a topic
    new TopicMessageQuery()
      .setTopicId(topicId)
      .setStartTime(0)
      .subscribe(client, null, (message) => {
        let messageAsString = Buffer.from(message.contents, 'utf8').toString();
        console.log(`${message.consensusTimestamp.toDate()} Received: ${messageAsString}`);
      });
  };
  
  const submitMsg = async (topicId, message) => {
    const client = await getClient();
  
    // Send one message
    const sendResponse = await new TopicMessageSubmitTransaction({
      topicId,
      message,
    }).execute(client);
  
    //Get the receipt of the transaction
    const getReceipt = await sendResponse.getReceipt(client);
  
    //Get the status of the transaction
    const transactionStatus = getReceipt.status;
    console.log('The message transaction status: ' + transactionStatus.toString());
  
    return true;
  };
  
  const getClient = async () => {
    // If we weren't able to grab it, we should throw a new error
    if (Account1_ID == null || Account1_KEY == null) {
      throw new Error(
        'Environment variables Account1_ID and Account1_KEY must be present'
      );
    }
  
    // Create our connection to the Hedera network
    return Client.forTestnet().setOperator(Account1_ID, Account1_KEY);
  };
  
  // execution init
  main();
  