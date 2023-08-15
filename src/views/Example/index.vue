<template>
  <div>
    <h2>Dark Mode</h2>
    <div>
      <p>主题颜色：{{ darkModeRef }}</p>
      <Button type="primary" @click="toggleSysColor">切换系统颜色</Button>
      <Button type="default" @click="resetSysColor">重置</Button>
      <Button type="default" @click="openBluetooth">打开蓝牙</Button>
      <Button type="default" @click="cancelBluetooth">取消蓝牙</Button>
      <Button type="default" @click="handleHID">HID访问</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'ant-design-vue'
defineOptions({
  name: 'Example',
})

const darkModeRef = ref('system')
const { darkMode } = window

const toggleSysColor = async () => {
  const isDarkMode = await darkMode.toggle()
  darkModeRef.value = isDarkMode ? 'dark' : 'light'
}
const resetSysColor = async () => {
  const res = await darkMode.system()
  console.log(res, 'reset')
}

const openBluetooth = () => {}
const cancelBluetooth = () => {}

const handleHID = () => {}
</script>
