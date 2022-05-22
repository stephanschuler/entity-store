import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
    taskQueue: 'async',
    namespace: 'js-test-lib',
    outputTargets: [
        {
            type: 'dist-custom-elements',
            dir: 'dist',
            generateTypeDeclarations: true
        },
    ],
};
