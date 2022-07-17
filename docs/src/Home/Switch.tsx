import { ChangeEvent, useEffect, useState } from 'react'
import { styled } from '@styls/react'

export const SwitchWapper = styled('label', () => ({
  zIndex: 2,
  position: 'relative',
  borderRadius: 28,
  overflow: 'hidden',
  backdropFilter: 'saturate(180%) blur(14px)',

  '& input': {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    border: 'none',
    appearance: 'none'
  }
}))

const SwitchChecked = styled(
  'div',
  () => ({
    position: 'relative',
    width: 68,
    height: 38,
    background: '#e6e8eb8d',
    zIndex: 0,
    margin: 0,
    padding: 0,
    appearance: 'none',
    border: 0,
    transition: 'all 0.3s',

    '&::after': {
      position: 'absolute',
      left: 6,
      top: 6,
      width: 26,
      height: 26,
      borderRadius: '50%',
      backgroundColor: '#fff',
      content: '🌛',
      transition: 'all 0.3s',
      lineHeight: '26px',
      textAlign: 'center'
    }
  }),
  () => ({
    checked: {
      true: {
        backgroundColor: '#4dd865',
        '&::after': {
          transform: 'translateX(30px)',
          content: '☀️'
        }
      },
      false: {}
    }
  })
)

export default function Switch({
  checked,
  onChange
}: {
  checked?: boolean
  onChange?: (value: boolean) => void
}) {
  const [isChecked, setIsChecked] = useState(checked)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.checked
    setIsChecked(value)
    if (!onChange) {
      return
    }
    onChange(value)
  }

  return (
    <SwitchWapper>
      <input type="checkbox" checked={isChecked} onChange={onInputChange} />
      <SwitchChecked variants={{ checked: `${isChecked}` }} />
    </SwitchWapper>
  )
}
