<script setup lang="ts">
import { styled } from '@styils/vue'
import { ref } from 'vue'

const Button = styled(
  'button',
  {},
  {
    size: {
      max: {
        color: 'blue'
      },
      small: {
        color: 'yellow'
      }
    }
  }
)

const count = ref(0)
const type = ref<'max' | 'small'>('max')
</script>

<template>
  <Button :variants="{ size: type }" @click="type = type === 'max' ? 'small' : 'max'">hello</Button>
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
