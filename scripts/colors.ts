const ansi = (id: number) => `\x1b[${id}m`
const escape = (string: string) => string.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&')
const ansiRe = RegExp(escape(ansi(0)), 'g')

export const color = (string: string, id: number) =>
  ansi(id) + string.replace(ansiRe, ansi(0) + ansi(id)) + ansi(0)
export const green = (string: string) => color(string, 32)
export const bold = (string: string) => color(string, 1)
export const dim = (string: string) => color(string, 2)
export const underline = (string: any) => color(string, 4)
export const invert = (string: string) => color(string, 7)
export const cyan = (string: string) => color(string, 36)
export const white = (string: any) => color(string, 37)
export const red = (string: string) => color(string, 31)

export const pad = (string: string, size = 0, char = ' ') =>
  string.padStart((string.length + size) / 2, char).padEnd(size, char)

export const box = ({
  name,
  types
}: {
  name: string
  types: Record<string, Record<'min' | 'gzp', string>>
}) => {
  const border = (text: string) => dim(cyan(text))
  const v = border('│')
  const h = (size: number | undefined) => border(pad('', size, '┈'))

  const nameLead = pad('', 16 - name.length / 2)
  const nameTail = pad('', nameLead.length + (name.length % 2))
  const nullLine = pad('', 32)

  const kb = (kb: string) => bold(green(kb.slice(0, -3))) + ' ' + dim(kb.slice(-2))

  return [
    border(`╭────────────────────────────────╮`),
    `${v}${nameLead}${bold(white(name))}${nameTail}${v}`,
    `${v}${nullLine}${v}`,
    ...Object.entries(types).map(([type, { min, gzp }]) =>
      [
        `${v}  ${h(15 - type.length)} ${cyan(type)} ${h(
          15 - type.length - (type.length % 2)
        )}  ${v}`,
        `${v}  ${' '.repeat(3 - (min.length % 2))}${kb(min + ' kB')}${' '.repeat(3)} ${border(
          '╷'
        )} ${' '.repeat(3 - (gzp.length % 2))}${kb(gzp + ' kB')}${' '.repeat(3)} ${v}`,
        `${v}    ${dim(cyan('minified'))}    ${border('╵')}    ${dim(cyan('gzipped'))}    ${v}`
      ].join('\n')
    ),
    border(`╰────────────────────────────────╯`)
  ].join('\n')
}
