import { Arguments } from 'yargs';
import { deepMerge } from '../Utils';

export const deepMergeArgv = (argv: Arguments): object => {
  delete argv._;
  delete argv.version;
  delete argv.help;
  delete argv.$0;

  const config = {};
  deepMerge(config, argv);
  return config;
};
