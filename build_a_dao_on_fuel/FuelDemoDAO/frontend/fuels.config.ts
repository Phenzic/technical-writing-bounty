import { createConfig } from 'fuels';

export default createConfig({
  contracts: [
        '../contract',
  ],
  output: './src/contracts-api',
});

/**
 * Check the docs:
 * https://fuellabs.github.io/fuels-ts/tooling/cli/fuels/config-file
 */
