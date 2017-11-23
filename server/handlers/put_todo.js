'use strict';

const common = require('./common.todo')

exports.handler = (event, context, callback) => {
    console.log('Received PUT event:', JSON.stringify(event, null, 2));

    callback(common.makeResponse(new Error("NOT IMPLEMENTED")))
}