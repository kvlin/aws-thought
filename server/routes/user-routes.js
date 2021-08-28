const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

// Connect with local DynamoDB instance
const awsConfig = {
    region: "us-east-2",
};

AWS.config.update(awsConfig);

// DocumentClient for native JavaScript interace
const dynamodb = new AWS.DynamoDB.DocumentClient()
const table = "Thoughts";

// Route to retrieve all user thougths
router.get('/users', (req, res) => {
    const params = {
        TableName: table
    };
    // Scan return all items in the tables
    dynamodb.scan(params, (err, results) => {
        if (err) {
            res.status(500).json(err)
        } else {
            res.json(results.Items)
        }
    })
})

// Route to return all thoughts from a particular user
router.get('/users/:username', (req, res) => {
    console.log(`Querying for thought(s) from ${req.params.username}.`);

    // params to define the query call to DynamoDB
    const params = {
        TableName:table,
        // define aliases with # prefix - best practice to avoid list of reserved words like 'date', 'time', 'user', 'data'
        ExpressionAttributeNames: { 
            "#un": "username",
            "#ca": "createdAt",
            "#th": "thought"
        },
        // values use aliases with : prefix 
        ExpressionAttributeValues: {
            ":user": req.params.username 
        },
        // specifies the search criteria
        KeyConditionExpression: "#un = :user", 
        // determines which attributes (or columns) will be returned
        ProjectionExpression: "#th, #ca",
        // specifies the order of the sort key - default to true (ascending)
        // we want decending here for most recent thoughts on top
        ScanIndexForward: false
    }

    // query method for collection of items(the scan method scans the whole table - more time, 
    // query method directly looks up based on primary or secondary partition/hash key )
    dynamodb.query(params, (err, data) => {
        if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
          res.status(500).json(err); // an error occurred
        } else {
          console.log("Query succeeded.");
          res.json(data.Items)
        }
    });

});

// Create new user at /api/users
// Create new user
router.post('/users', (req, res) => {
    const params = {
      TableName: table,
      Item: {
        "username": req.body.username,
        "createdAt": Date.now(),
        "thought": req.body.thought
      }
    };
    dynamodb.put(params, (err, data) => {
      if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        res.status(500).json(err); // an error occurred
      } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
        res.json({"Added": JSON.stringify(data, null, 2)});
      }
    });
  });


module.exports = router;

