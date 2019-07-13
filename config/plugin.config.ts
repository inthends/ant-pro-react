import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import Config from 'webpack-chain';

export default (config: Config) => {
  config.resolve.plugin('ts-config-paths').use(TsconfigPathsPlugin as any);
  return config;
};
