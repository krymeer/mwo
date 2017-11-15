'use strict';
const AWS = require('aws-sdk');
const common = require('./common.todo')
// DynamoDB API
const dynamo = common.dynamo();

exports.handler = (event, context, callback) => {
    console.log('Received GET event:', JSON.stringify(event, null, 2));
    common.getTableName('Todos')
        .then(actualName => {
            return dynamo.scan({
                TableName: actualName,
                Index: 'UserIndex',
                FilterExpression: 'UserID = :user_id',
                ExpressionAttributeValues: {':user_id': 'test1234'} // use logged in user's id
            }).promise()
        })
        .then(data => callback(null, common.makeResponse(null, data)))
        .catch(error => callback(null, common.makeResponse(error, null)))
}
