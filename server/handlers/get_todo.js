'use strict';
const AWS = require('aws-sdk');
const common = require('./common.todo')
// DynamoDB API
const dynamo = common.dynamo();

exports.handler = (event, context, callback) => {
    console.log('Received GET event:', JSON.stringify(event, null, 2));

    if(event.resource == "/todo/{id}") {
        let noteID = event.pathParameters.id
        console.log(`Fetching note for ID=${noteID}`)
        common.getTableName('Todos')
        .then(actualName => {
            return dynamo.query({
                TableName: actualName,
                Index: 'UserIndex',
                FilterExpression: 'ID = :id',
                ExpressionAttributeValues: {':id': noteID}
            }).promise()
        })
        .then(data => callback(null, common.makeResponse(null, data.Items || {Items: []})))
        .catch(error => callback(null, common.makeResponse(error, null)))
    } else {
        let userID = event.requestContext.authorizer.claims.sub
        console.log(`Fetching notes for UserID=${userID}`)
        common.getTableName('Todos')
        .then(actualName => {
            return dynamo.query({
                TableName: actualName,
                Index: 'UserIndex',
                FilterExpression: 'UserID = :user_id',
                ExpressionAttributeValues: {':user_id': userID}
            }).promise()
        })
        .then(data => callback(null, common.makeResponse(null, data.Items || {Items: []})))
        .catch(error => callback(null, common.makeResponse(error, null)))
    }

}
