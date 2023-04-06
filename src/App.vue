<script lang="ts" setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
const routers = useRouter()

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>
<template>
  <a-config-provider :locale="zhCN">
    <div class="warp">
      <!-- 左侧 -->
      <div class="slide">
        slide
      </div>
      <!-- content -->
      <div class="content">
        content
      </div>
    </div>
  </a-config-provider>
</template>

<style lang="less" scoped>
.warp {
  display: flex;
  font-size: 100px;
}

.slide {
  height: 100vh;
  background: #431dff;
  width: 30vw;
}

.content {
  height: 100vh;
  width: 70vw;
  background: saddlebrown;
}
</style>
