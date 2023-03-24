import { createApp } from 'vue'
import router from './router/index'
import App from '@/App.vue'
import 'ant-design-vue/dist/antd.variable.min.css'
import './styles/global.less'
import QueryTable from './components/BusinessComponent/QueryTable/index.vue'
import Antd from 'ant-design-vue'
import store from '@/piniaStore/index'

const app = createApp({ ...App })
app.component('QueryTable', QueryTable)
app
  .use(router)
  .use(Antd)
  .use(store)
  .mount('#app')

