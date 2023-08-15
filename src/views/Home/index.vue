<template>
  <div>
    <p>node:{{ node }}</p>
    <p>chrome:{{ chrome }}</p>
    <p>electron:{{ electron }}</p>
    <br />
    <hr />
    <p>chromeVersionRef:{{ chromeVersionRef }}</p>
    <p>electronVersionRef:{{ electronVersionRef }}</p>
    <p>打开的文件位置：{{ fileUrl }}</p>
    <div>
      <Button type="primary" @click="handleClick">按钮</Button>
      <Button type="primary" danger @click="handleClick2"> web page</Button>
      <Button type="dashed" @click="handleSetTitle">渲染进程通信主进程2</Button>
      <Button type="dashed" @click="handleSetTitle2">渲染进程通信主进程</Button>
      <Button type="dashed" @click="handleSetTitle3">主进程通信渲染进程</Button>
      <Button type="dashed" @click="handleSetTitle4">双向通信</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'ant-design-vue'
defineOptions({
  name: 'Home',
})

const node = window.versions.node
const chrome = window.versions.chrome
const electron = window.versions.electron
console.log(window.versions.version)
console.log(window.versions.process)

const handleClick = async () => {
  const res = await window.versions.ping()
  console.log(res, 'res')
}

const handleClick2 = async () => {
  const res = await window.versions.webPage()
  console.log(JSON.parse(res), 'res2')
}

const handleSetTitle = () => {
  window.versions.setTitle('标题')
}

const handleSetTitle2 = () => {
  const res = window.electronAPI.setTitle('自定义标题')
  console.log(res, 'res')
}

const chromeVersionRef = ref('')
const electronVersionRef = ref('')
const handleSetTitle3 = () => {
  window.electronAPI.getElectronVersion((event: object, version: string) => {
    console.log(event, version)
    electronVersionRef.value = version
  })

  window.electronAPI.getChromeVersion((value: string) => {
    chromeVersionRef.value = value
  })
}

const fileUrl = ref('')
const handleSetTitle4 = async () => {
  const res = await window.electronAPI.openFile()
  fileUrl.value = res
  console.log(res)
}
</script>

<style scoped></style>
