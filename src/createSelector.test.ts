import { createSelector } from './createSelector'

describe('createSelector', () => {
  it('regression: global', () => {
    const obj = { button: { fontSize: 14, color: 'red' }, fontSize: 12 }
    const res = createSelector(obj)
    expect(obj).toEqual({ button: { fontSize: 14, color: 'red' }, fontSize: 12 })

    expect(`${res}`).toEqual('864292721')
  })

  it('regression: keyframes', () => {
    const obj = {
      from: {
        transform: 'rotate(0deg)'
      },
      to: {
        transform: 'rotate(360deg)'
      }
    }
    const res = createSelector(obj)

    expect(obj).toEqual({
      from: {
        transform: 'rotate(0deg)'
      },
      to: {
        transform: 'rotate(360deg)'
      }
    })

    expect(`${res}`).toEqual('524936959')
  })
})
