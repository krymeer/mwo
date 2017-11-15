const auth = (() => {
    const poolData = {
        UserPoolId: 'eu-central-1_1dEhQvStV',
        ClientId: '81kb7a691go156589n3qh15c7'
    }
    const cognito = AWSCognito.CognitoIdentityServiceProvider;
    const userPool = new cognito.CognitoUserPool(poolData);

    const promiseCallback = (resolve, reject) => (err, result) => {
        if (err) {
            reject(err)
        }
        resolve(result)
    }

    const signUp = (username, password, email) => {
        let attributes = [
            new cognito.CognitoUserAttribute({ Name: 'email', Value: email })
        ]
        return new Promise((resolve, reject) => userPool.signUp(username, password, attributes, null, promiseCallback(resolve, reject)))
        .then(result => result.user)
    }

    const confirm = (username, code) => {
        let user = new cognito.CognitoUser({Username: username, Pool: userPool})
        return new Promise((resolve, reject) => user.confirmRegistration(code, true, promiseCallback(resolve, reject)))
    }

    const signIn = (username, password) => {
        let authDetails = new cognito.AuthenticationDetails({Username: username, Password: password})
        let user = new cognito.CognitoUser({Username: username, Pool: userPool})
        return new Promise((resolve, reject) => user.authenticateUser(authDetails, {onSuccess: resolve, onFailure: reject}))
    }

    return {
        signUp, confirm, signIn
    }
})()