import { createTransformer } from 'babel-jest';

export default createTransformer({
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
});
