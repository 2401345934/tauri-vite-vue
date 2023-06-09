<template name="Home">
  <div class="warp">
    <div v-show="!$state.fullscreenFlag" class="header">
      <Header></Header>
    </div>
    <div
      class="slide"
      v-show="!$state.fullscreenFlag"
      :class="menuStore.$state.collapsed && 'slide_w'"
    >
      <a-menu
        :inline-collapsed="menuStore.$state.collapsed"
        @click="changeMenuKey"
        mode="inline"
        :selectedKeys="selectedKeys"
        :openKeys="openKey"
      >
        <template v-for="item in route" :key="item.path">
          <a-sub-menu :key="item.path" v-if="item.children">
            <template #title>
              <span>{{ item.meta.title }}</span>
            </template>
            <template
              v-for="childrenRouter in item.children"
              :key="childrenRouter.path"
            >
              <a-menu-item
                :title="childrenRouter.meta.title"
                :index="childrenRouter.path"
              >
                <span>{{ childrenRouter.meta.title }}</span>
              </a-menu-item>
            </template>
          </a-sub-menu>
          <a-menu-item :title="item.meta.title" :key="item.path" v-else>
            <span>{{ item.meta.title }}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </div>
    <keep-alive>
      <div
        class="content_warp"
        :class="$state.fullscreenFlag ? 'full_evaluation' : 'content_warp'"
      >
        <MultiTabComponent></MultiTabComponent>
        <div class="content">
          <!-- <transition mode="out-in" appear enter-active-class="animate__animated animate__lightSpeedInRight"
            leave-active-class="animate__animated animate__lightSpeedOutRight"> -->
          <ComponentWarp :detailTitle="detailTitle">
            <template #main>
              <router-view v-slot="{ Component, route }">
                <keep-alive>
                  <component
                    v-if="route.meta.keepAlive"
                    :is="Component"
                    :key="route.path"
                  />
                </keep-alive>
                <component
                  v-if="!route.meta.keepAlive"
                  :is="Component"
                  :key="route.path"
                />
              </router-view>
            </template>
          </ComponentWarp>
          <!-- </transition> -->
        </div>
      </div>
    </keep-alive>
  </div>
</template>
<script lang="ts" setup>
import router, { RouterType } from '@/router/index'
import Header from '@/components/Header/index.vue'
import ComponentWarp from '@/components/ComponentWarp/index.vue'
import MultiTabComponent from '@/components/MultiTab/index.vue'
import { theme } from '@/piniaStore/module/theme'
import { menu } from '@/piniaStore/module/menu'
import { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import { multiTab } from '@/piniaStore/module/multiTab'

const multiTabStore = multiTab()
const { $state } = multiTabStore
const routers = useRouter()
const store = theme()
const menuStore = menu()
const route: any = router.options.routes[0].children
const pathname = ref(routers.currentRoute.value.fullPath)
const selectedKeys = ref<string[]>([])
const openKey = ref<string[]>([])
const routerFlat = ref<RouterType[]>([])
const changeMenuKey = (i: MenuInfo) => {
  selectedKeys.value = i.keyPath as string[]
  if (i.key) {
    router.push(i.key as any)
  } else {
    router.push('/404')
  }
}

onMounted(() => {
  const keysArr = routers.currentRoute.value.matched.map(d => d.path)
  keysArr.splice(0, 1)
  selectedKeys.value = keysArr
  openKey.value = keysArr
  store.updateTheme()
  deepRouter(route)
  togglefullscreenFlag($state.fullscreenFlag)
})

const togglefullscreenFlag = (fullscreenFlag: boolean) => {
  // true 是全屏幕
  // false  取消全凭
  const isFullScreen: any =
    document.fullscreen ||
    (document as any).webkitIsFullScreen ||
    (document as any).mozFullScreen
  const contentEle: any = document.querySelector(`.content_warp`)
  // 全屏幕
  if (contentEle && !isFullScreen && fullscreenFlag) {
    let fullScreenEle: any =
      contentEle.requestFullscreen ||
      contentEle.mozRequestFullScreen ||
      contentEle.webkitRequestFullScreen ||
      contentEle.msRequestFullscreen
    if (fullScreenEle) {
      // 是否全屏
      // fullScreenEle.call(contentEle);
      return
    }
  }
  // 取消全凭
  if (document && isFullScreen && !fullscreenFlag) {
    let exitFullScreen: any =
      document.exitFullscreen ||
      (document as any).mozCancelFullScreen ||
      (document as any).webkitCancelFullScreen ||
      (document as any).msExitFullscreen
    if (exitFullScreen) {
      // 是否取消 全屏
      // exitFullScreen.call(document);
      return
    }
  }
}

watch(
  () => $state.fullscreenFlag,
  (v: boolean) => {
    togglefullscreenFlag(v)
  }
)

watch(
  () => routers.currentRoute.value.fullPath,
  () => {
    const keysArr = routers.currentRoute.value.matched.map(d => d.path)
    keysArr.splice(0, 1)
    selectedKeys.value = keysArr
    openKey.value = keysArr
  }
)

// 递归打平
const deepRouter = (routers: RouterType[]) => {
  if (routers && Array.isArray(routers)) {
    routers.forEach((d: RouterType) => {
      if (d.children) {
        deepRouter(d.children)
      } else {
        routerFlat.value.push(d)
      }
    })
  }
}

const detailTitle: any = () => {
  return routerFlat.value.find((item: any) => item.path === pathname.value)
    ?.meta?.title
}

routers.afterEach((to: any) => {
  if (pathname.value === to.fullPath) return
  pathname.value = to.fullPath
})
</script>
<style scoped lang="less">
.warp {
  min-height: 100vh;
  width: 100%;

  .slide {
    width: 208px;
    height: 100vh;
    min-width: 208px;
    overflow-y: auto;
    z-index: 20;
    overflow-x: hidden;
    position: fixed;
    border: none;
    padding-top: 60px;
    transition: var(--menu_transition);
    background-color: var(--a-menu-bg);

    :deep(.ant-menu) {
      background-color: var(--a-menu-bg) !important;
    }
  }

  .slide_w {
    width: 80px;
    transition: var(--menu_transition);
    min-width: 80px;
  }

  .header {
    height: 60px;
    display: flex;
    z-index: 30;
    position: fixed;
    width: 100%;
    align-items: center;
    background-color: var(--a-header-bg);
  }

  .content_warp {
    display: flex;
    position: relative;
    padding-top: 60px;
    background: #fff;
    height: calc(100vh - 71px);
    width: 100%;

    .content {
      flex: 1;
      padding-top: 50px;
      margin-left: 208px;
      width: calc(100vw - 208px);
    }

    .content_div {
      margin-top: 30px;
    }
  }

  .full_evaluation {
    height: calc(100vh);
    padding-top: 0;

    .content {
      flex: 1;
      padding-top: 50px;
      margin-left: 0;
      width: calc(100vw - 0);
    }
  }

  .a-menu-item.is-active {
    color: inherit;
  }
}
</style>
