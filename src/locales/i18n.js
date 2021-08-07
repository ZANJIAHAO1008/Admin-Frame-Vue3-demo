import {createI18n} from 'vue-i18n'
import Cookies from "js-cookie";
import messages from "./index.js"
// $t('message.public.editLang') 页面中使用
const i18n = createI18n({
    locale: Cookies.get('lang') || 'zh-cn',
    messages
})

export default i18n
