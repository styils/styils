<script setup lang="ts">
import { SystemProvider } from './theme'
import { ref } from 'vue'
import Test from './Test.vue'
import { styled } from './theme'

const count = ref(0)

const Menu = styled('div', (theme) => ({
  display: 'flex',
  gap: '20px',
  position: 'sticky',
  top: '0',
  transition: 'linear .3s',
  color: theme?.color
}))

const NMenu = styled(Menu, (theme) => ({
  top: '100px'
}))
</script>

<template>
  <SystemProvider>
    <Test />
    <NMenu>hello</NMenu>
    <div class="card">
      <button type="button" @click="count++" ref="">count is {{ count }}</button>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
    </div>

    <p>
      Check out
      <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the
      official Vue + Vite starter
    </p>
    <p>
      Install
      <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
      in your IDE for a better DX
    </p>
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  </SystemProvider>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
