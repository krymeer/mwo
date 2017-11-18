import { CognitoUser, CognitoUserAttribute, CognitoUserPool, AuthenticationDetails } from 'amazon-cognito-identity-js'

const poolData = {
    UserPoolId: 'eu-central-1_1dEhQvStV',
    ClientId: '81kb7a691go156589n3qh15c7'
}

const userPool = new CognitoUserPool(poolData)

const promiseCallback = (resolve, reject) => (err, result) => {
    if (err) {
        reject(err)
    }
    resolve(result)
}
const signUp = (username, password, email) => {
    let attributes = [
        new CognitoUserAttribute({ Name: 'email', Value: email })
    ]
    return new Promise((resolve, reject) => userPool.signUp(username, password, attributes, null, promiseCallback(resolve, reject)))
        .then(result => result.user)
}

const confirm = (username, code) => {
    let user = new CognitoUser({ Username: username, Pool: userPool })
    return new Promise((resolve, reject) => user.confirmRegistration(code, true, promiseCallback(resolve, reject)))
}

const signIn = (username, password) => {
    let authDetails = new AuthenticationDetails({ Username: username, Password: password })
    let user = new CognitoUser({ Username: username, Pool: userPool })
    return new Promise((resolve, reject) => user.authenticateUser(authDetails, { onSuccess: resolve, onFailure: reject }))
}

export default {
    signUp, confirm, signIn
}