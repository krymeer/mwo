/**
 * Global config, immports etc
 */

import Vue from 'vue'
import App from './app.vue'

let app = new Vue({
    el: "app",
    render: h => h(App)
})

Vue.config.devtools = true
