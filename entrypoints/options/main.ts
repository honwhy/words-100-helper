import { createApp } from 'vue'
import './bootstrap.css'
import './option.css'
import App from './index.vue'
import iframeResize from './iframeResize'

const app = createApp(App)
app.directive('resize', iframeResize)
app.mount('#app')
