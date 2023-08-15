<template>
  <div>
    调用动态链接库 Dll
    <Button type="primary">按钮</Button>
    <!-- <Button type="primary" @click="() => libm.AddInt(1, 2)">按钮</Button> -->
  </div>
</template>

<script setup lang="ts">
import { Button } from 'ant-design-vue'

defineOptions({
  name: 'Dll',
})
</script>

<style scoped></style>
