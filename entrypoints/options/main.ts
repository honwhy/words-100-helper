import { createApp } from 'vue'
// 引入 Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import './option.css'
import App from './index.vue'
import tryImport from '@/utils/tryImport'

tryImport()
const app = createApp(App)
app.mount('#app')
