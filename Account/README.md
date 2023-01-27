# Hedera-certifiction

The is the code base to implement a demo to fetch contract events from mirror node

### Instructions

1. `npm i` to install dependent packages
2. run `npx hardhat compile` to compile the contract and generate the artifacts
3. run `npm run start:deploytohedera` to deploy the contract to hedera and note down the contract address after deployment
4. copy the contract address and paste it in the environment file mentioning the **CONTRACT_ID**
5. run `npm run start:storevalue` to run the script to store a number by calling the Store function in contract this will run in a 10 second intervals to generate as much events
6. run `npm run start:retrievevalue` in a separate cmd tab to check the current stored value by calling the retrieve method from the contract
7. run `npm run start:getcontractevents` in a separate tab to fetch the events list from mirror node, this will be calling in a ten second interval to get the updated list
