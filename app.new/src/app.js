/**
 * Global config, immports etc
 */

import Vue from 'vue'
import App from './app.vue'
import GoogleAuth from 'vue-google-oauth'

const app = new Vue({
    el: "app",
    render: h => h(App)
})

Vue.config.devtools = true
Vue.use(GoogleAuth, { client_id: '198563637102-uvfqdt9ih217rdqjk83fhma3ctbglh20.apps.googleusercontent.com' })
Vue.googleAuth().load()