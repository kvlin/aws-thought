const AWS = require('aws-sdk');

// file system to read the user.json seed file
const fs = require('fs');

// create interface with DynamoDB
AWS.config.update({
    region: "us-east-2",
    endpoint: "http://localhost:8000"
  });

// Create service interface object
const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

console.log("Importing thoughts into DynamoDB. Please wait.");

// Assign the seed array of objects to allUsers constant
const allUsers = JSON.parse(fs.readFileSync('./server/seed/users.json', 'utf8'));

// Loop over the allUsers array and create the params object with the array elements
allUsers.forEach(user => {
    const params = {
        TableName: "Thoughts",
        Item: {
            "username": user.username,
            "createdAt": user.createdAt,
            "thought": user.thought
        }
    };
    // Make call to the db using the put method to add the new item, 
    dynamodb.put(params, (err, data) => {
        if (err) {
          console.error("Unable to add thought", user.username, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("PutItem succeeded:", user.username);
        }
    });
})
