'use strict';
/**
 * Code used for multiple endpoints
 */
// For mapping constant logical IDs to variable physical IDs
const AWS = require('aws-sdk');
const stack = new AWS.CloudFormation();

exports.makeResponse = (err, res) => {
    if (err) {
        console.error("An error occurred:", err)
    }
    return {
        statusCode: err ? '400' : '200',
        body: err ? JSON.stringify({Error: err.message}) : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
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
                if (err) {
                    console.error(`DescribeStackResource ${logicalName} failed: `, err)
                    reject(err)
                } else {
                    resolve(data.StackResourceDetail.PhysicalResourceId)
                }
            }
        )
    })
}
