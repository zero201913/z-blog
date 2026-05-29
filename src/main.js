import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import BaseButton from './components/BaseButton.vue'

import './styles/global.css'
import './styles/components.css'
import './styles/layout.css'
import './styles/responsive.css'

const app = createApp(App)

app.component('BaseButton', BaseButton)

app.use(router)
app.mount('#app')
