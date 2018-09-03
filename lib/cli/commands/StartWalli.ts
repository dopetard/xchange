import { Arguments } from 'yargs';
import { startWalli } from '../Command';

export const command = 'startwalli';

export const describe = 'Start Walli server';

export const handler = (argv: Arguments): void => {
  const walli = startWalli(argv);
  walli.start();
};
