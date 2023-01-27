# Hedera-certifiction

The is the code base to implement a demo to fetch contract events from mirror node

### Instructions

1. `npm i` to install dependent packages
2. Run `node .\scripts\errorCase.js` 
3. Run `node .\scripts\successCase.js` 


### Error Output

The Multi Signature Account ID is: 0.0.15001

Balance of 0.0.15001: 2000000000 tinybars.

Balance of 0.0.13103: 10000000000 tinybars.

The transaction errored with message INVALID_SIGNATURE

Error:{"name":"StatusError","status":"INVALID_SIGNATURE","transactionId":"0.0.1358@1674829490.576641266","message":"receipt for transaction 0.0.1358@1674829490.576641266 contained error status INVALID_SIGNATURE"}

### Success Output

The Multi Signature Account ID is: 0.0.15052

Balance of 0.0.15052: 2000000000 tinybars.

Balance of 0.0.13103: 10000000000 tinybars.
The transaction status is SUCCESS

Balance of 0.0.15052: 1000000000 tinybars.

Balance of 0.0.13103: 11000000000 tinybars.
