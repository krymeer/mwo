<template>
    <script type="text/javascript" src="lib/axios/dist/axios.standalone.js"></script>
    <script type="text/javascript" src="lib/CryptoJS/rollups/hmac-sha256.js"></script>
    <script type="text/javascript" src="lib/CryptoJS/rollups/sha256.js"></script>
    <script type="text/javascript" src="lib/CryptoJS/components/hmac.js"></script>
    <script type="text/javascript" src="lib/CryptoJS/components/enc-base64.js"></script>
    <script type="text/javascript" src="lib/url-template/url-template.js"></script>
    <script type="text/javascript" src="lib/apiGatewayCore/sigV4Client.js"></script>
    <script type="text/javascript" src="lib/apiGatewayCore/apiGatewayClient.js"></script>
    <script type="text/javascript" src="lib/apiGatewayCore/simpleHttpClient.js"></script>
    <script type="text/javascript" src="lib/apiGatewayCore/utils.js"></script>
    <script type="text/javascript" src="apigClient.js"></script>
</template>

<script>
import auth from "./auth";

    export default {
        sendGET: function(){
            var userData = auth.getUser();
            var apigClient = apigClientFactory.newClient();
            var params = {
                "Authorization" : userData.idToken
            };
            return apigClient.todoGet(params, null, undefined);
        }

        sendGETid: function(id){
            var userData = auth.getUser();
            var apigClient = apigClientFactory.newClient();
            var params = {
                "Authorization" : userData.idToken,
                "id" : id
            };
            return apigClient.todoGet(params, null, undefined);
        }

        sendPOST: function(Context){
            var userData = auth.getUser();
            var apigClient = apigClientFactory.newClient();
            var params = {
                "Authorization" : userData.idToken
            };
            var body = {
                "Context": Context
            }
            return apigClient.todoIdPut(params, body, undefined);
        }

        sendPUT: function(id, Context){
            var userData = auth.getUser();
            var apigClient = apigClientFactory.newClient();
            var params = {
                "Authorization" : userData.idToken,
                "id" : id
            };
            var body = {
                "Context": Context
            };
            return apigClient.todoIdDelete(params, body, undefined);
        }

        sendDELETE: function(id){
            var userData = auth.getUser();
            var apigClient = apigClientFactory.newClient();
            var params = {
                "Authorization" : userData.idToken,
                "id" : id
            };
            return apigClient.todoIdDelete(params, null, undefined);
        }
    }
</script>