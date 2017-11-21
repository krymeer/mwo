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

/**
 * Register a new user
 * @param {string} username
 * @param {string} password
 * @param {string} email
 */
const signUp = (username, password, email) => {
    let attributes = [
        new CognitoUserAttribute({ Name: 'email', Value: email })
    ]
    return new Promise((resolve, reject) => userPool.signUp(username, password, attributes, null, promiseCallback(resolve, reject)))
        .then(result => result.user)
}

/**
 * Confirm a user's registration
 * @param {string} username
 * @param {string} code confirmation code
 */
const confirm = (username, code) => {
    let user = new CognitoUser({ Username: username, Pool: userPool })
    return new Promise((resolve, reject) => user.confirmRegistration(code, true, promiseCallback(resolve, reject)))
}

/**
 * Try to log a user in. Must be already confirmed.
 * @param {*} username
 * @param {*} password
 */
const signIn = (username, password) => {
    let authDetails = new AuthenticationDetails({ Username: username, Password: password })
    let user = new CognitoUser({ Username: username, Pool: userPool })
    return new Promise((resolve, reject) => user.authenticateUser(authDetails, { onSuccess: resolve, onFailure: reject }))
}

/**
 * Get the currently logged in user.
 * Returns a promise
 */
const getUser = () => {
    let user = userPool.getCurrentUser()
    if (user == null) {
        return Promise.resolve(null)
    }
    return Promise.all([
        new Promise((resolve, reject) => user.getSession(promiseCallback(resolve, reject))),
        new Promise((resolve, reject) => user.getUserAttributes(promiseCallback(resolve, reject)))
    ]
    ).then(results => {
        let idToken = results[0].idToken
        let userID = results[1].filter(x => x.Name === 'sub')[0]
        return { idToken, userID }
    })

    // return new Promise((resolve, reject) => user.getSession(promiseCallback(resolve, reject)))
    //     .then(session => ({ user, session }))
    //     .then(result => new Promise((resolve, reject) => ({ user: result.user, session: result.session, attributes: result.user.getUserAttributes(promiseCallback(resolve, reject)) })))
    //     .then(console.log)
}

const signOut = () => {
    let user = userPool.getCurrentUser()
    user.signOut()
}

export default {
    signUp, confirm, signIn, getUser, signOut
}