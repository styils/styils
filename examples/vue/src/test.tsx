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

const AA = defineComponent({
  props: ['test'],
  setup() {
    return () => <div>123</div>
  }
})

export default defineComponent({
  setup() {
    return () => <Button as={AA} test="1" />
  }
})
