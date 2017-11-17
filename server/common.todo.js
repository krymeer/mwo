'use strict';
/**
 * Code used for multiple endpoints
 */
// For mapping constant logical IDs to variable physical IDs
const AWS = require('aws-sdk');
const stack = new AWS.CloudFormation();

exports.makeResponse = (err, res) => {
    return {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: { 'Content-Type': 'application/json', }
    }
}

exports.dynamo = () => new AWS.DynamoDB.DocumentClient()

exports.validateTodo = todo => {
    return new Promise((resolve, reject) => {
        if (todo.ID && todo.UserID && todo.Content) {
            resolve(todo)
        }
        reject(new Error("todo is missing one or more properties"))
    })
}

// Logical name
exports.getTableName = (logicalName) => {
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