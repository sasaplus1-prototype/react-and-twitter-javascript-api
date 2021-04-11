import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import ts from '@wessberg/rollup-plugin-ts';

export default [
  {
    input: './index.tsx',
    output: {
      file: './index.js',
      format: 'umd',
      name: 'index'
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      nodeResolve(),
      commonjs(),
      ts({
        tsconfig(resolvedConfig) {
          return {
            ...resolvedConfig,
            target: 'ES5'
          };
        }
      })
    ]
  }
];
