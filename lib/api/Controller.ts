import UserManager from '../users/UserManager';
import { History } from '../history/HistoryManager';

class Controller {

  constructor(private userManager: UserManager) {}

  public addUser = async (_req, res) => {
    const user = await this.userManager.addUser();
    res.json({ user });
  }

  public getCurrency = async (req, res) => {
    const { user, currency } = req.body;
    try {
      const balance = await this.userManager.getBalance(user, currency);
      const history = this.userManager.getHistory(currency);
      res.json({
        balance,
        history,
      });
    } catch (exception) {
      this.handleException(exception, res);
    }
  }

  public getCurrencies = async (req, res) => {
    const { user } = req.body;
    try {
      const response: { [ currency: string ]: { balance: number, history: History } } = {};

      const balances = await this.userManager.getBalances(user);
      Object.keys(balances).forEach((currency) => {
        response[currency] = {
          balance: balances[currency],
          history: this.userManager.getBasicHistory(currency),
        };
      });

      res.json(response);
    } catch (exception) {
      this.handleException(exception, res);
    }
  }

  public getInvoice = async (req, res) => {
    const { user, currency, amount } = req.body;
    try {
      const invoice = await this.userManager.getInvoice(user, currency, amount);
      res.json({ invoice });
    } catch (exception) {
      this.handleException(exception, res);
    }
  }

  public payInvoice = async (req, res) => {
    const { user, invoice } = req.body;
    try {
      await this.userManager.payInvoice(user, invoice);
      res.json({ error: '' });
    } catch (exception) {
      this.handleException(exception, res);
    }
  }

  public requestTokenPayment = async (req, res) => {
    const { user, currency } = req.body;
    try {
      const request = await this.userManager.requestTokenPayment(user, currency);
      res.json(request);
    } catch (exception) {
      this.handleException(exception, res);
    }
  }

  public sendToken = async (req, res) => {
    const { user, currency, targetAddress, amount, identifier } = req.body;
    try {
      await this.userManager.sendToken(user, currency, targetAddress, amount, identifier);
      res.json({ error: '' });
    } catch (exception) {
      this.handleException(exception, res);
    }
  }

  private handleException = (exception: any, res: any) => {
    const message = (exception.message) ? exception.message : exception;
    res.status(400).json({ error: message });
  }
}

export default Controller;
