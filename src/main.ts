import { createApp } from 'vue'
import App from './App.vue'
import BootsrapVueNext from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
// @ts-ignore
import JsonExcel from 'vue-json-excel3'


createApp(App)
.use(BootsrapVueNext)
.component('downloadExcel', JsonExcel)
.mount('#app')