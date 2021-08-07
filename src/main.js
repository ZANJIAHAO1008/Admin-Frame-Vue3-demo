import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import './assets/css/font-awesome.min.css'
import store from './store'
import filters from "./filters";
import * as _public from "./util/utils";
import animated from 'animate.css'
// import i18n from '../src/locales/i18n.js'
import loadComponentE from './plugins/element.js'
import loadComponentI from './plugins/i18n.js'

const app = createApp(App)
loadComponentI(app)
loadComponentE(app)
app.config.globalProperties._public = _public;
app.config.globalProperties.$filters = filters;
app.use(ElementPlus)
// app.use(i18n)
app.use(animated)
app.use(router)
app.use(store)
app.mount('#app')
