import winston from 'winston';

class Logger {

  constructor(logFile: string) {
    const { format } = winston;
    winston.configure({
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
