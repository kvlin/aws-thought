const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

// Connect with local DynamoDB instance
const awsConfig = {
    region: "us-east-2",
    endpoint: "http://localhost:8000"
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

module.exports = router;

