'use strict';
const AWS = require('aws-sdk');
const common = require('./common.todo')
// DynamoDB API
const dynamo = common.dynamo();

exports.handler = (event, context, callback) => {
    console.log('Received PUT event:', JSON.stringify(event, null, 2));
    
    common.getTableName('Todos')
        .then(actualName => {
            return dynamo.update({
                TableName: actualName,
                Key:{
                    "ID": event.pathParameters.id
                },
                UpdateExpression: "set Content = :c",
                ExpressionAttributeValues:{
                    ":c": event.body.Content
                },
                ConditionExpression: "attribute_exists(ID)",
                ReturnValues:"UPDATED_NEW"
            }).promise()
        })
        .then(data => callback(null, common.makeResponse(null, data)))
        .catch(error => callback(null, common.makeResponse(error, null)))
    
}
