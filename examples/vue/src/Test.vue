<script lang="ts" setup>
import { ref } from 'vue'
import { styled, useSystem, createGlobal } from './theme'

const Button = styled(
  'button',
  (mode) => {
    return {
      '@keyframes comp': {
        '0%': {
          transform: 'translateY(0px)'
        },
        '30%': {
          transform: 'translateY(-10px)'
        },
        '50%': {
          transform: 'translateY(4px)'
        },
        '70%': {
          transform: 'translateY(-15px)'
        },
        '100%': {
          transform: 'translateY(0px)'
        }
      },
      animation: `13s ease 0.5s infinite none running comp`,
      color: mode!.color,
      height: '$height',
      backgroundColor: 'blue'
    }
  },
  {
    size: {
      small: {
        fontSize: '$height'
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
    :variants="{ size: type }"
    :vars="{ height: `${height}px` }"
    :class="{ hello: height === 60 }"
    style="display: flex; margin: 0 auto"
    >{{ type }}</Button
  >
</template>
