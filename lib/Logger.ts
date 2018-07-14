import winston from 'winston';

class Logger {

  constructor(logFile: string) {
    winston.configure({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
        new winston.transports.File({
          format: winston.format.simple(),
          filename: logFile,
        }),
      ],
    });
  }

  public info = (message: string) => {
    winston.log('info', message);
  }

  public warn = (message: string) => {
    winston.log('warn', message);
  }

  public error = (message: string) => {
    winston.log('error', message);
  }

}

export default Logger;
