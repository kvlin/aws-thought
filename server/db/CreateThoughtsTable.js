const AWS = require('aws-sdk');

// Modify the AWS config object that DynamoDB will use to connect to the local instance

AWS.config.update({
    region: "us-east-2"
  });

// Create the DynamoDB service interface object
// to ensure that API library used is compartible
const dynamodb = new AWS.DynamoDB({apiVersion:'2012-08-10'})

// Create 'params' object that will hold the schema and metadata of the table
const params = {
    TableName: 'Thoughts',
    KeySchema: [
        { AttributeName:'username', KeyType:'HASH' },// Partition key 
        { AttributeName:'createdAt', KeyType:'RANGE' } // Sort key 
    ],
    AttributeDefinitions: [
        { AttributeName: 'username', AttributeType: 'S'}, // string
        { AttributeName: 'createdAt', AttributeType: 'N'} // number
    ],
    // set maximum write and read capacity of the db
    ProvisionedThroughput: {
        ReadCapacityUnits:10,
        WriteCapacityUnits:10
    }
}

// Use the 'params' object to make a call to the DynamoDB instance and create a table
dynamodb.createTable(params, (err, data) => {
    //capture error and response
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

// INITIALISE java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb 
// BEFORE RUNNING THIS FILE

