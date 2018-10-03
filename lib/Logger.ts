import winston from 'winston';
import colors from 'colors/safe';
import { getTsString } from './Utils';

class Logger {

  // TODO: multiple loggeres for different scopes
  // TODO: 'trace' level instead of 'silly'
  constructor(filename: string, level: string) {
    winston.configure({
      level,
      transports: [
        new winston.transports.Console({
          format: this.getLogFormat(true),
        }),
        new winston.transports.File({
          filename,
          format: this.getLogFormat(false),
        }),
      ],
    });
  }

  private getLogFormat = (colorize: boolean) => {
    return winston.format.printf(info => `${getTsString()} ${this.getLevel(info.level, colorize)}: ${info.message}`);
  }

  private getLevel = (level: string, colorize: boolean) => {
    if (colorize) {
      switch (level) {
        case 'error': return colors.red(level);
        case 'warn': return colors.yellow(level);
        case 'info': return colors.green(level);
        case 'verbose': return colors.cyan(level);
        case 'debug': return colors.blue(level);
        case 'silly': return colors.magenta(level);
      }
    }
    return level;
  }

  public error = (message: string) => {
    winston.error(message);
  }

  public warn = (message: string) => {
    winston.warn(message);
  }

  public info = (message: string) => {
    winston.info(message);
  }

  public verbose = (message: string) => {
    winston.verbose(message);
  }

  public debug = (message: string) => {
    winston.debug(message);
  }

  public silly = (message: string) => {
    winston.silly(message);
  }
}

export default Logger;
