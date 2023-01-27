const {
    Client,
    ContractExecuteTransaction,
    ContractCreateFlow,
    ContractFunctionParameters,
  } = require('@hashgraph/sdk');
  const { hethers } = require('@hashgraph/hethers');
  require('dotenv').config();
  const contractJSON = require('../certificate.json');
  
  const abicoder = new hethers.utils.AbiCoder();
  
  //Grab your Hedera testnet account ID and private key from your .env file
  const { CLIENT_PRIVATE_KEY, CLIENT_ID } = process.env;
  
  const main = async () => {
    const client = await getClient();
  
    //Extracting bytecode from compiled code
    const bytecode = contractJSON.bytecode;
  
    //Create the transaction
    const contractCreation = new ContractCreateFlow().setGas(100000).setBytecode(bytecode);
  
    //Sign the transaction with the client operator key and submit to a Hedera network
    const txResponse = await contractCreation.execute(client);
  
    //Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);
  
    //Get the new contract ID
    const contractId = receipt.contractId;
  
    console.log('The contract ID is ' + contractId);
  
    //Create the transaction to call function1
    const firstFunctionExecution = new ContractExecuteTransaction()
      //Set the ID of the contract
      .setContractId(contractId)
      //Set the gas for the contract call
      .setGas(100000)
      //Set the contract function to call
      .setFunction('function1', new ContractFunctionParameters().addUint16(4).addUint16(3));
  
    //Submit the transaction to a Hedera network and store the response
    const submitFirstFunctionExec = await firstFunctionExecution.execute(client);
  
    const record = await submitFirstFunctionExec.getRecord(client);
  
    const encodedResult1 = '0x' + record.contractFunctionResult.bytes.toString('hex');
  
    const result1 = abicoder.decode(['uint16'], encodedResult1);
  
    console.log('Function 1 Output :', result1[0]);
  
    //Create the transaction to update the contract message
    const submitSecondFunctionExec = new ContractExecuteTransaction()
      //Set the ID of the contract
      .setContractId(contractId)
      //Set the gas for the contract call
      .setGas(100000)
      //Set the contract function to call
      .setFunction('function2', new ContractFunctionParameters().addUint16(result1[0]));
  
    //Submit the transaction to a Hedera network and store the response
    const submitExecTx2 = await submitSecondFunctionExec.execute(client);
  
    const record2 = await submitExecTx2.getRecord(client);
  
    const encodedResult2 = '0x' + record2.contractFunctionResult.bytes.toString('hex');
  
    const result2 = abicoder.decode(['uint16'], encodedResult2);
  
    console.log('Function 2 Output :', result2[0]);
  
    process.exit();
  };
  
  //To create client object
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
  
  main();
  