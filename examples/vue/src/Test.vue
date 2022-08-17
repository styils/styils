<script lang="ts" setup>
import { ref } from 'vue'
import { styled, useSystem, createGlobal } from './theme'

const Button = styled(
  'button',
  (mode) => {
    return {
      color: mode!.color,
      height: '$height',
      backgroundColor: 'blue'
    }
  },
  {
    size: {
      small: {
        fontSize: 32
      },
      max: {
        fontSize: 12
      }
    }
  }
)

createGlobal({
  body: {
    backgroundColor: 'cadetblue'
  }
})

const { mode, setMode } = useSystem()

const updata = () => {
  setMode(mode.value === 'light' ? 'dark' : 'light')
  height.value += 10
  type.value = type.value === 'max' ? 'small' : 'max'
}

const type = ref<'max' | 'small'>('max')
const height = ref(40)
</script>

<template>
  <Button
    @click="updata"
    :vars="{ height: `${height}px` }"
    :class="{ hello: height === 60 }"
    style="display: flex; margin: 0 auto"
    >{{ type }}</Button
  >
</template>
