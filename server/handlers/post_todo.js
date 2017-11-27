'use strict';

const common = require('./common.todo')
const crypto = require('crypto');
const dynamo = common.dynamo()

const makeID = (len, chars) => {
    chars = chars || 'ybndrfg8ejkmcpqxot1uwisza3345h769';
    var randomBytes = crypto.randomBytes(len);
    return Array.from(randomBytes)
        .map(x => x & (1 << 5) - 1)
        .map(x => chars[x])
        .join("");
}

exports.handler = (event, context, callback) => {
    console.log('Received POST event:', JSON.stringify(event, null, 2));
    let payload = undefined
    try {
        payload = JSON.parse(event.body)
    } catch (err) {
        callback(null, common.makeResponse(err))
    }
    let todo = {
        ID: makeID(8),
        UserID: event.requestContext.authorizer.claims.sub,
        Content: payload.Content,
        CreatedAt: Date.now()
    }
    console.log("new note:", todo)
    common.validateTodo(todo)
        .then(todo => common.getTableName('Todos'))
        .then(actualName => {
            return dynamo.put({
                TableName: actualName,
                Item: todo,
            }).promise().then(_ => todo)
        })
        .then(data => callback(null, common.makeResponse(null, data)))
        .catch(error => callback(null, common.makeResponse(error)));
}