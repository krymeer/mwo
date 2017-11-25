'use strict';
const AWS = require('aws-sdk');
const common = require('./common.todo')
// DynamoDB API
const dynamo = common.dynamo();

exports.handler = (event, context, callback) => {
    console.log('Received GET event:', JSON.stringify(event, null, 2));

    if(event.resource == "/todo/{id}"){
        common.getTableName('Todos')
        .then(actualName => {
            return dynamo.scan({
                TableName: actualName,
                Index: 'UserIndex',
                FilterExpression: 'ID = :id',
                ExpressionAttributeValues: {':id': event.pathParameters.id}
            }).promise()
        })
        .then(data => callback(null, common.makeResponse(null, data.items || {Items: []})))
        .catch(error => callback(null, common.makeResponse(error, null)))
    } else {
        common.getTableName('Todos')
        .then(actualName => {
            return dynamo.scan({
                TableName: actualName,
                Index: 'UserIndex',
                FilterExpression: 'UserID = :user_id',
                ExpressionAttributeValues: {':user_id': event.requestContext.authorizer.claims.sub}
            }).promise()
        })
        .then(data => callback(null, common.makeResponse(null, data.items || {Items: []})))
        .catch(error => callback(null, common.makeResponse(error, null)))
    }

}
