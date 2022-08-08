import { parseRules } from './parse'

describe('parseRules rules', () => {
  it('regular', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        display: 'value',
        button: {
          border: '0'
        }
      },
      'base'
    )

    expect(ruleCode).toEqual(['base{display:value;}', 'base button{border:0;}'].join(''))

    expect(segmentRuleCode).toEqual(['base{display:value;}', 'base button{border:0;}'])
  })

  it('Pass the value', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        display: 'value',
        button: {
          border: '$border'
        }
      },
      'base'
    )

    expect(ruleCode).toEqual(`base{display:value;}base button{border:var(--base-border);}`)

    expect(segmentRuleCode).toEqual([
      'base{display:value;}',
      'base button{border:var(--base-border);}'
    ])
  })

  it('camel-case', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        fooBarProperty: 'value',
        button: {
          webkitPressSomeButton: '0'
        },
        '&.nested': {
          foo: '1px',
          backgroundEffect: 'scale(1), translate(1)'
        }
      },
      'base'
    )

    expect(ruleCode).toEqual(
      [
        'base{foo-bar-property:value;}',
        'base button{webkit-press-some-button:0;}',
        'base.nested{foo:1px;background-effect:scale(1), translate(1);}'
      ].join('')
    )

    expect(segmentRuleCode).toEqual([
      'base{foo-bar-property:value;}',
      'base button{webkit-press-some-button:0;}',
      'base.nested{foo:1px;background-effect:scale(1), translate(1);}'
    ])
  })

  it('complex media', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        '.button': {
          '@media screen': {
            '.style': {
              width: 500,
              button: {
                color: 'red'
              },
              height: 1,
              span: {
                text: '1',
                h1: {
                  fontSize: 14
                },
                color: 'blue'
              }
            }
          }
        }
      },
      'base'
    )

    expect(ruleCode).toEqual(
      '@media screen{base .button .style{width:500px;height:1px;}base .button .style button{color:red;}base .button .style span{text:1;color:blue;}base .button .style span h1{font-size:14px;}}'
    )

    expect(segmentRuleCode).toEqual([
      '@media screen{base .button .style{width:500px;height:1px;}base .button .style button{color:red;}base .button .style span{text:1;color:blue;}base .button .style span h1{font-size:14px;}}'
    ])
  })

  it('native', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        '@import': "url('path/to')",
        '@font-face': {
          'font-weight': 100
        },
        'text-align': 'center',
        '.logo': {
          animation: 'App-logo-spin infinite 20s linear',
          height: '40vmin',
          'pointer-events': 'none'
        },
        '.header': {
          'background-color': '#282c34',
          'min-height': '100vh',
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'center',
          'justify-content': 'center',
          'font-size': 'calc(10px + 2vmin)',
          color: 'white'
        },
        '.link': {
          color: '#61dafb'
        },
        '@keyframes App-logo-spin': {
          from: {
            transform: 'rotate(0deg)'
          },
          to: {
            transform: 'rotate(360deg)'
          }
        }
      },
      'App'
    )
    expect(ruleCode).toEqual(
      [
        "@import url('path/to');",
        '@font-face{font-weight:100;}',
        'App{text-align:center;}',
        'App .logo{animation:App-logo-spin infinite 20s linear;height:40vmin;pointer-events:none;}',
        'App .header{background-color:#282c34;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:calc(10px + 2vmin);color:white;}',
        'App .link{color:#61dafb;}',
        '@keyframes App-logo-spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}'
      ].join('')
    )

    expect(segmentRuleCode).toEqual([
      "@import url('path/to');",
      '@font-face{font-weight:100;}',
      'App{text-align:center;}',
      'App .logo{animation:App-logo-spin infinite 20s linear;height:40vmin;pointer-events:none;}',
      'App .header{background-color:#282c34;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:calc(10px + 2vmin);color:white;}',
      'App .link{color:#61dafb;}',
      '@keyframes App-logo-spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}'
    ])
  })

  it('unwrapp', () => {
    const { ruleCode, segmentRuleCode } = parseRules({
      '--foo': 1,
      opacity: 1,
      '@supports': {
        '--bar': 'none'
      },
      html: {
        background: 'red'
      }
    })

    expect(ruleCode).toEqual(
      ['--foo:1;opacity:1;', 'html{background:red;}', '@supports{--bar:none;}'].join('')
    )

    expect(segmentRuleCode).toEqual([
      '--foo:1;opacity:1;',
      'html{background:red;}',
      '@supports{--bar:none;}'
    ])
  })

  it('nested with multiple selector', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        display: 'value',
        '&:hover,&:focus': {
          border: '0',
          span: {
            index: 'unset',
            index2: 'unset'
          }
        },
        'p,b,i': {
          display: 'block',
          '&:focus,input': {
            opacity: 1,
            'div,span': {
              opacity: 0
            }
          }
        }
      },
      'base'
    )
    expect(ruleCode).toEqual(
      [
        'base{display:value;}',
        'base:hover,base:focus{border:0;}',
        'base:hover span,base:focus span{index:unset;index2:unset;}',
        'base p,base b,base i{display:block;}',
        'base p:focus,base p input,base b:focus,base b input,base i:focus,base i input{opacity:1;}',
        'base p:focus div,base p:focus span,base p input div,base p input span,base b:focus div,base b:focus span,base b input div,base b input span,base i:focus div,base i:focus span,base i input div,base i input span{opacity:0;}'
      ].join('')
    )

    expect(segmentRuleCode).toEqual([
      'base{display:value;}',
      'base:hover,base:focus{border:0;}',
      'base:hover span,base:focus span{index:unset;index2:unset;}',
      'base p,base b,base i{display:block;}',
      'base p:focus,base p input,base b:focus,base b input,base i:focus,base i input{opacity:1;}',
      'base p:focus div,base p:focus span,base p input div,base p input span,base b:focus div,base b:focus span,base b input div,base b input span,base i:focus div,base i:focus span,base i input div,base i input span{opacity:0;}'
    ])
  })

  it('should handle the :where(a,b) cases', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        div: {
          ':where(a, b)': {
            color: 'blue'
          }
        },
        span: {
          ':where(a, b)': {
            color: 'red',
            fontSize: 15
          }
        }
      },
      ''
    )
    expect(ruleCode).toEqual(
      'div :where(a, b){color:blue;}span :where(a, b){color:red;font-size:15px;}'
    )

    expect(segmentRuleCode).toEqual([
      'div :where(a, b){color:blue;}',
      'span :where(a, b){color:red;font-size:15px;}'
    ])
  })

  it('should handle null and undefined values', () => {
    expect(
      parseRules(
        {
          div: {
            opacity: 0,
            color: null
          }
        },
        ''
      )
    ).toEqual({ ruleCode: 'div{opacity:0;}', segmentRuleCode: ['div{opacity:0;}'] })
    expect(
      parseRules(
        {
          div: {
            opacity: 0,
            color: undefined // or `void 0` when minified
          }
        },
        ''
      )
    ).toEqual({ ruleCode: 'div{opacity:0;}', segmentRuleCode: ['div{opacity:0;}'] })
  })

  it('does not transform the case of custom CSS variables', () => {
    expect(
      parseRules(
        {
          '--cP': 'red'
        },
        ''
      )
    ).toEqual({ ruleCode: '--cP:red;', segmentRuleCode: ['--cP:red;'] })
    expect(
      parseRules(
        {
          '--c-P': 'red'
        },
        ''
      )
    ).toEqual({ ruleCode: '--c-P:red;', segmentRuleCode: ['--c-P:red;'] })
    expect(
      parseRules(
        {
          '--cp': 'red'
        },
        ''
      )
    ).toEqual({ ruleCode: '--cp:red;', segmentRuleCode: ['--cp:red;'] })
    expect(
      parseRules(
        {
          ':root': {
            '--cP': 'red'
          }
        },
        ''
      )
    ).toEqual({ ruleCode: ':root{--cP:red;}', segmentRuleCode: [':root{--cP:red;}'] })
  })

  it('@import', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        '@import': "url('https://domain.com/path?1=s')"
      },
      'base'
    )

    expect(ruleCode).toEqual(["@import url('https://domain.com/path?1=s');"].join(''))

    expect(segmentRuleCode).toEqual(["@import url('https://domain.com/path?1=s');"])
  })

  it('@media', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        '@media any all (no-really-anything)': {
          position: 'absolute'
        }
      },
      'base'
    )

    expect(ruleCode).toEqual(
      ['@media any all (no-really-anything){base{position:absolute;}}'].join('')
    )

    expect(segmentRuleCode).toEqual([
      '@media any all (no-really-anything){base{position:absolute;}}'
    ])
  })

  it('@supports', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        '@supports (some: 1px)': {
          '@media (s: 1)': {
            display: 'flex'
          }
        },
        '@supports': {
          opacity: 1
        }
      },
      'base'
    )

    expect(ruleCode).toEqual(
      [
        '@supports (some: 1px){@media (s: 1){base{display:flex;}}}',
        '@supports{base{opacity:1;}}'
      ].join('')
    )

    expect(segmentRuleCode).toEqual([
      '@supports (some: 1px){@media (s: 1){base{display:flex;}}}',
      '@supports{base{opacity:1;}}'
    ])
  })

  it('@keyframes', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        '@keyframes superAnimation': {
          '11.1%': {
            opacity: '0.9999'
          },
          '111%': {
            opacity: '1'
          }
        },
        '@keyframes foo': {
          to: {
            baz: '1px',
            foo: '1px'
          }
        },
        '@keyframes complex': {
          'from, 20%, 53%, 80%, to': {
            transform: 'translate3d(0,0,0)'
          },
          '40%, 43%': {
            transform: 'translate3d(0, -30px, 0)'
          },
          '70%': {
            transform: 'translate3d(0, -15px, 0)'
          },
          '90%': {
            transform: 'translate3d(0,-4px,0)'
          }
        }
      },
      'base'
    )

    expect(ruleCode).toEqual(
      [
        '@keyframes superAnimation{11.1%{opacity:0.9999;}111%{opacity:1;}}',
        '@keyframes foo{to{baz:1px;foo:1px;}}',
        '@keyframes complex{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0);}40%, 43%{transform:translate3d(0, -30px, 0);}70%{transform:translate3d(0, -15px, 0);}90%{transform:translate3d(0,-4px,0);}}'
      ].join('')
    )

    expect(segmentRuleCode).toEqual([
      '@keyframes superAnimation{11.1%{opacity:0.9999;}111%{opacity:1;}}',
      '@keyframes foo{to{baz:1px;foo:1px;}}',
      '@keyframes complex{from, 20%, 53%, 80%, to{transform:translate3d(0,0,0);}40%, 43%{transform:translate3d(0, -30px, 0);}70%{transform:translate3d(0, -15px, 0);}90%{transform:translate3d(0,-4px,0);}}'
    ])
  })

  it('@font-face', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        '@font-face': {
          'font-weight': 100
        }
      },
      'base'
    )

    expect(ruleCode).toEqual(['@font-face{font-weight:100;}'].join(''))

    expect(segmentRuleCode).toEqual(['@font-face{font-weight:100;}'])
  })

  it('@page', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        '@page': {
          size: '8.5in 11in',
          margin: '10%',
          '@top-left': {
            content: "'Hamlet asdf'"
          },
          '@top-right': {
            content: `"Page " counter(page)`
          }
        }
      },
      'base'
    )

    expect(ruleCode).toEqual(
      `@page{size:8.5in 11in;margin:10%;@top-left{content:"'Hamlet asdf'";}@top-right{content:"Page " counter(page);}}`
    )

    expect(segmentRuleCode).toEqual([
      `@page{size:8.5in 11in;margin:10%;@top-left{content:"'Hamlet asdf'";}@top-right{content:"Page " counter(page);}}`
    ])
  })

  it('@namespace', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        '@namespace svg': 'url(http://www.google.com)',
        '@namespace button': '"http://www.google.com"',
        '@namespace': '"http://www.google.com"'
      },
      ''
    )

    expect(ruleCode).toEqual(
      [
        '@namespace svg url(http://www.google.com);',
        '@namespace button "http://www.google.com";',
        '@namespace "http://www.google.com";'
      ].join('')
    )

    expect(segmentRuleCode).toEqual([
      '@namespace svg url(http://www.google.com);',
      '@namespace button "http://www.google.com";',
      '@namespace "http://www.google.com";'
    ])
  })

  it('@counter-style', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        '@counter-style smile': {
          system: 'cyclic',
          symbols: '🧞',
          suffix: ' '
        }
      },
      ''
    )

    expect(ruleCode).toEqual(['@counter-style smile{system:cyclic;symbols:🧞;suffix: ;}'].join(''))

    expect(segmentRuleCode).toEqual(['@counter-style smile{system:cyclic;symbols:🧞;suffix: ;}'])
  })

  it(':global', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        ':global': {
          '.bar': {
            color: 'red'
          }
        },
        '.test': {
          ':global': {
            '.foo': {
              fontSize: 14,
              button: {
                color: 'red'
              }
            }
          }
        }
      },
      'base'
    )

    expect(ruleCode).toEqual(
      ['.bar{color:red;}.foo{font-size:14px;}', '.foo button{color:red;}'].join('')
    )

    expect(segmentRuleCode).toEqual([
      '.bar{color:red;}',
      '.foo{font-size:14px;}',
      '.foo button{color:red;}'
    ])
  })

  it('repeat css', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        ':global': {
          '.foo': {
            fontSize: 14
          }
        },
        '.test': {
          ':global': {
            '.foo': {
              fontSize: 14
            }
          }
        }
      },
      'base'
    )

    expect(ruleCode).toEqual(['.foo{font-size:14px;}'].join(''))

    expect(segmentRuleCode).toEqual(['.foo{font-size:14px;}'])
  })
  it('multiple selector', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        '.foo': {
          fontSize: 14
        }
      },
      'foo, bar'
    )

    expect(ruleCode).toEqual(['foo .foo, bar .foo{font-size:14px;}'].join(''))

    expect(segmentRuleCode).toEqual(['foo .foo, bar .foo{font-size:14px;}'])
  })

  it('pseudo elements Special characters', () => {
    const { ruleCode, segmentRuleCode } = parseRules(
      {
        '.foo': {
          '&::after': {
            content: `\\0025B6`
          },
          '&::before': {
            content: `\\0025B6\\0025B6 'hello'`
          }
        }
      },
      ''
    )

    expect(ruleCode).toEqual(
      ['.foo::after{content:"\\0025B6";}.foo::before{content:"\\0025B6\\0025B6 \'hello\'";}'].join(
        ''
      )
    )

    expect(segmentRuleCode).toEqual([
      '.foo::after{content:"\\0025B6";}',
      '.foo::before{content:"\\0025B6\\0025B6 \'hello\'";}'
    ])
  })
})
