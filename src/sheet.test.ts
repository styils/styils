import { StyleSheet } from './sheet'

const rule = 'html { color: hotpink; }'
const rule2 = '* { box-sizing: border-box; }'

const defaultOptions = {
  key: '',
  container: document.head
}

console.error = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
})

beforeEach(() => {
  document.head.innerHTML = ''
  document.body.innerHTML = ''
})

describe('StyleSheet', () => {
  it('should be speedy by default in production', () => {
    const sheet = new StyleSheet({ ...defaultOptions, speedy: true })
    expect(sheet.speedy).toBe(true)
    process.env.NODE_ENV = 'test'
  })

  it('should not be speedy in a non-production environment by default', () => {
    const sheet = new StyleSheet(defaultOptions)
    expect(sheet.speedy).toBe(undefined)
  })

  it('should remove its style elements from the document when flushed', () => {
    const sheet = new StyleSheet(defaultOptions)
    sheet.insert(rule)
    expect(document.documentElement).toMatchSnapshot()
    sheet.flush()
    expect(document.documentElement).toMatchSnapshot()
  })

  it('should set the data-styls attribute to the key option', () => {
    const key = 'some-key'
    const sheet = new StyleSheet({ ...defaultOptions, key })
    sheet.insert(rule)
    expect(document.documentElement).toMatchSnapshot()
    expect(document.querySelector('[data-styls]')?.getAttribute('data-styls')).toBe(key)
    sheet.flush()
  })

  it('should insert a rule into the DOM when not in speedy', () => {
    const sheet = new StyleSheet(defaultOptions)
    sheet.insert(rule)
    expect(document.documentElement).toMatchSnapshot()
    sheet.flush()
  })

  it('should insert a rule with insertRule when in speedy', () => {
    const sheet = new StyleSheet({ ...defaultOptions, speedy: true })
    sheet.insert(rule)
    expect(document.documentElement).toMatchSnapshot()
    expect(sheet.tags).toHaveLength(1)

    expect(sheet.tags[0].sheet?.cssRules).toMatchSnapshot()
    sheet.flush()
  })

  it('should throw when inserting a bad rule in speedy mode', () => {
    const sheet = new StyleSheet({ ...defaultOptions, speedy: true })
    sheet.insert('.asdfasdf4###112121211{')
    expect(console.error).toHaveBeenCalledTimes(1)

    sheet.flush()
  })

  it('should set the nonce option as an attribute to style elements', () => {
    const nonce = 'some-nonce'
    const sheet = new StyleSheet({ ...defaultOptions, nonce })
    sheet.insert(rule)
    expect(sheet.tags[0]).toBe(document.querySelector('[data-styls]'))
    expect(sheet.tags).toHaveLength(1)
    expect(sheet.tags[0].getAttribute('nonce')).toBe(nonce)
    sheet.flush()
  })

  it("should use the container option instead of document.head to insert style elements into if it's passed", () => {
    const container = document.createElement('div')
    document.body
    document.body.appendChild(container)
    const sheet = new StyleSheet({ ...defaultOptions, container })
    expect(sheet.container).toBe(container)
    sheet.insert(rule)
    expect(document.documentElement).toMatchSnapshot()
    expect(sheet.tags).toHaveLength(1)
    expect(sheet.tags[0].parentNode).toBe(container)
    sheet.flush()
  })

  it('should work with a ShadowRoot container', () => {
    const div = document.createElement('div')
    document.body
    document.body.appendChild(div)
    const container = div.attachShadow({ mode: 'open' })
    const sheet = new StyleSheet({ ...defaultOptions, container })
    expect(sheet.container).toBe(container)
    sheet.insert(rule)
    expect(document.documentElement).toMatchSnapshot()
    // The shadowRoot is not serialized in the snapshot, so we need to take a
    // separate snapshot of the shadowRoot's children.
    expect(container.children).toMatchSnapshot()
    expect(sheet.tags).toHaveLength(1)
    expect(sheet.tags[0].parentNode).toBe(container)
    sheet.flush()
  })

  it('should accept prepend option', () => {
    const { head } = document
    const otherStyle = document.createElement('style')
    otherStyle.setAttribute('id', 'other')
    head.appendChild(otherStyle)

    const sheet = new StyleSheet({ ...defaultOptions, prepend: true })
    sheet.insert(rule)
    sheet.insert(rule2)
    expect(document.documentElement).toMatchSnapshot()

    sheet.flush()
  })

  it('should accept insertionPoint option', () => {
    const { head } = document

    head.innerHTML = `
      <style id="first"></style>
      <style id="last"></style>
    `

    // the sheet should be inserted between the first and last style nodes
    const sheet = new StyleSheet({
      ...defaultOptions
    })
    sheet.insert(rule)
    sheet.insert(rule2)
    expect(document.documentElement).toMatchSnapshot()

    sheet.flush()
  })

  it('should work if insertionPoint is last element', () => {
    const { head } = document
    const lastStyle = document.createElement('style')
    lastStyle.setAttribute('id', 'last')
    head.appendChild(lastStyle)

    // the sheet should be inserted after the first node
    const sheet = new StyleSheet({
      ...defaultOptions
    })
    sheet.insert(rule)
    sheet.insert(rule2)
    expect(document.documentElement).toMatchSnapshot()

    sheet.flush()
  })

  it('should be able to hydrate styles', () => {
    const fooStyle = document.createElement('style')
    fooStyle.textContent = '.foo { color: hotpink; }'
    const barStyle = document.createElement('style')
    barStyle.textContent = '.bar { background-color: green; }'
    const { body } = document
    body.appendChild(fooStyle)
    body.appendChild(barStyle)

    const sheet = new StyleSheet(defaultOptions)
    expect(document.documentElement).toMatchSnapshot()

    expect(document.documentElement).toMatchSnapshot()

    sheet.flush()
  })

  it('should flush hydrated styles', () => {
    const fooStyle = document.createElement('style')
    fooStyle.textContent = '.foo { color: hotpink; }'
    const barStyle = document.createElement('style')
    barStyle.textContent = '.bar { background-color: green; }'
    const { body } = document
    body.appendChild(fooStyle)
    body.appendChild(barStyle)

    const sheet = new StyleSheet(defaultOptions)

    sheet.insert(rule)
    sheet.insert(rule2)
    expect(document.documentElement).toMatchSnapshot()

    sheet.flush()

    expect(document.documentElement).toMatchSnapshot()
  })

  it('should correctly position hydrated styles when used with `prepend` option', () => {
    const { head } = document
    const otherStyle = document.createElement('style')
    otherStyle.setAttribute('id', 'other')
    head.appendChild(otherStyle)

    const fooStyle = document.createElement('style')
    fooStyle.textContent = '.foo { color: hotpink; }'
    const barStyle = document.createElement('style')
    barStyle.textContent = '.bar { background-color: green; }'
    const { body } = document
    body.appendChild(fooStyle)
    body.appendChild(barStyle)

    const sheet = new StyleSheet({
      ...defaultOptions,
      prepend: true
    })

    expect(document.documentElement).toMatchSnapshot()

    sheet.flush()
  })

  it('should not crash when flushing when styles are already detached', () => {
    const { head } = document

    const sheet = new StyleSheet(defaultOptions)

    sheet.insert(rule)

    head.innerHTML = ''

    expect(() => sheet.flush()).not.toThrowError()
  })

  it('`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted.', () => {
    const sheet = new StyleSheet(defaultOptions)

    sheet.insert(rule)
    sheet.insert('@import url(http://google.com)')

    expect(console.error).toHaveBeenCalledWith(
      [
        `You're attempting to insert the following rule:\n@import url(http://google.com)\n\n`,
        '`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted.',
        'Please ensure that `@import` rules are before all other rules.'
      ].join('')
    )
  })
})
