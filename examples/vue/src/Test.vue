<script lang="ts" setup>
import { ref } from 'vue'
import { styled, useSystem } from './theme'

const Button = styled(
  'button',
  (mode) => {
    return {
      color: mode!.color,
      height: '$height'
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

const { mode, setMode } = useSystem()

const updata = () => {
  setMode(mode.value === 'light' ? 'dark' : 'light')

  type.value = type.value === 'max' ? 'small' : 'max'
}

const type = ref<'max' | 'small'>('max')
</script>

<template>
  <Button @click="updata">{{ type }}</Button>
</template>
