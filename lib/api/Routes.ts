import express from 'express';
import UserManager from '../users/UserManager';
import Controller from './Controller';

export const registerRoutes = (app: express.Application, userManager: UserManager) => {
  const controller = new Controller(userManager);

  app.route('/adduser').post(controller.addUser);

  app.route('/currency').post(controller.getCurrency);
  app.route('/currencies').post(controller.getCurrencies);

  app.route('/getinvoice').post(controller.getInvoice);
  app.route('/payinvoice').post(controller.payInvoice);

  app.route('/requesttokenpayment').post(controller.requestTokenPayment);
  app.route('/sendtoken').post(controller.sendToken);
};
