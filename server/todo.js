'use strict';

console.log('Loading function');

const AWS = require('aws-sdk');
const crypto = require('crypto');

const dynamo = new AWS.DynamoDB.DocumentClient();
const stack = new AWS.CloudFormation();

const makeResponse = (err, res) => {
    return {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: { 'Content-Type': 'application/json', }
    }
}

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    switch (event.httpMethod) {
        case 'DELETE':
            dynamo.deleteItem(JSON.parse(event.body), respond);
            break;
        case 'GET':
            dynamo.scan({ TableName: event.queryStringParameters.TableName }, respond);
            break;
        case 'POST':
            dynamo.putItem(JSON.parse(event.body), respond);
            break;
        case 'PUT':
            dynamo.updateItem(JSON.parse(event.body), respond);
            break;
        default:
            respond(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};

exports.get = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    callback(null, makeResponse(null, "GET received"));

}

exports.post = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    if (event.httpMethod != 'POST') {
        callback(new Error(`Unsupported method "${event.httpMethod}"`));
    }
    let body = JSON.parse(event.body);
    getTableName('Todos')
        .then(actualName => {
            console.log("ActualName:", actualName)
            dynamo.put({
                TableName: actualName,
                Item: {
                    "ID": makeID(8),
                    "Content": body.contents
                }
            }, (err, data) => { callback(err, makeResponse(data)) })
        })
        .catch(error => callback(error));

}

// Logical name
const getTableName = (logicalName) => {
    return new Promise((resolve, reject) => {
        stack.describeStackResource({
            StackName: 'mwo-todo',
            LogicalResourceId: logicalName
        },
            (err, data) => {
                console.log('DescribeStackResource: err=', err, "data=", data)
                if (err) {
                    reject(err)
                } else {
                    resolve(data.StackResourceDetail.PhysicalResourceId)
                }
            }
        )
    })
}

const makeID = (len, chars) => {
    chars = chars || 'ybndrfg8ejkmcpqxot1uwisza3345h769';
    var randomBytes = crypto.randomBytes(len);
    return Array.from(randomBytes)
        .map(x => x & (1 << 5) - 1)
        .map(x => chars[x])
        .join("");
}



exports.delete = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    callback(null, makeResponse(null, "received DELETE"));
}

