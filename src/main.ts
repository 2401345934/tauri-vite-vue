import { createApp } from 'vue'
import App from '@/App.vue'
import 'ant-design-vue/dist/antd.variable.min.css'
import './styles/global.less'
import Antd from 'ant-design-vue'
import store from '@/piniaStore/index'

const app = createApp({ ...App })
app
  .use(Antd)
  .use(store)
  .mount('#app')

