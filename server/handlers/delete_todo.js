'use strict';
const AWS = require('aws-sdk');
const common = require('./common.todo')
// DynamoDB API
const dynamo = common.dynamo();

exports.handler = (event, context, callback) => {
    console.log('Received DELETE event:', JSON.stringify(event, null, 2));
    
    common.getTableName('Todos')
        .then(actualName => {
            return dynamo.delete({
                TableName: actualName,
                Key:{
                    "ID": event.pathParameters.id
                }
            }).promise()
        })
        .then(data => callback(null, common.makeResponse(null, data)))
        .catch(error => callback(null, common.makeResponse(error, null)))
    
}
