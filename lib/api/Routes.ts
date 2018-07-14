import express from 'express';
import UserManager from '../users/UserManager';
import Controller from './Controller';

export const registerRoutes = (app: express.Application, userManager: UserManager) => {
  const controller = new Controller(userManager);

  app.route('/user').post(controller.addUser);

  app.route('/sendpayment').post(controller.sendPayment);

  app.route('/balance').post(controller.getBalance);

  app.route('/balances').post(controller.getBalances);
};
