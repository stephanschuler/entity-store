import pkg from './package.json';

const cjs = {
    format: 'cjs',
    file: pkg.main,
};
const esm = {
    format: 'esm',
    file: pkg.module,
};

export default {
    input: 'build/index.js',

    output: [
//        cjs,
        esm,
    ],
    external: ['@stencil/core', '@stencil/store', 'rxjs']
};