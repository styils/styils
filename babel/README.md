## @styils/babel-plugin

This is required for sourcemap

### Use

```json
// .babelrc
// Make sure to put it first to make the sourcemap more readable
{
  "plugins": ["@styils"]
}
```

### Custom transform

[refer to](../docs/vite.config.ts)

### Parameter

```typescript
export interface Options {
  identifier?: {
    styled?: string
    global?: string
  }
  importPaths?: string | RegExp
  sourceFileName?: string
  sourceRoot?: string
}
```

#### Identifier

default: `{ styled:'styled', global:'global' }`

Used to mark the function name, compile time will lookup based on the function name to confirm if it is the target

#### ImportPaths

default: `"@styils/react"`

Used for styled or global import paths, and will only be loaded if matched

#### SourceFileName

default: `undefined`

Only needed when custom conversion, used to display the target file name

#### SourceRoot

default: `undefined`

The file path of `SourceFileName`
