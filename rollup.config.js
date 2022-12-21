import typescript from '@rollup/plugin-typescript'
import cleanup from 'rollup-plugin-cleanup'
import pkg from './package.json'

export default [
  {
    input: 'src/useChildRef.tsx',
    output: [
      {
        file: pkg.exports['.'],
        format: 'es',
        exports: 'named',
      },
    ],
    plugins: [typescript({ include: ['src/useChildRef.tsx'] }), cleanup()],
    external: ['react', 'react-dom'],
  },
]
