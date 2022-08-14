import { defineComponent } from 'vue'
import { styled } from '../../../src/vueSystem'

const Button = styled(
  'button',
  {},
  {
    size: {
      max: {
        color: 'blue'
      },
      small: {
        color: '$yellow'
      }
    }
  }
)

export default defineComponent({
  setup() {
    return () => <Button as="button" />
  }
})
