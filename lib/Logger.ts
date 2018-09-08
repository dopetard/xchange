import winston from 'winston';

// TODO: add time to log format
// TODO: configurable log level
class Logger {

  constructor(logFile: string) {
    const { format } = winston;
    winston.configure({
      level: 'verbose',
      transports: [
        new winston.transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
        new winston.transports.File({
          format: format.simple(),
          filename: logFile,
        }),
      ],
    });
  }

  public verbose = (message: string) => {
    winston.verbose(message);
  }

  public info = (message: string) => {
    winston.info(message);
  }

  public warn = (message: string) => {
    winston.warn(message);
  }

  public error = (message: string) => {
    winston.error(message);
  }
}

export default Logger;
