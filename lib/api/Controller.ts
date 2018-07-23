import UserManager from '../users/UserManager';

class Controller {

  constructor(private userManager: UserManager) {}

  public addUser = async (_req, res) => {
    const user = await this.userManager.addUser();
    res.json({ user });
  }

  public payInvoice = async (req, res) => {
    const { user, invoice } = req.body;
    try {
      this.userManager.payInvoice(user, invoice);
      res.json({ error: '' });
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

  public getBalance = async (req, res) => {
    const { user, currency } = req.body;
    try {
      const balance = await this.userManager.getBalance(user, currency);
      res.json({ balance });
    } catch (exception) {
      this.handleException(exception, res);
    }
  }

  public getBalances = async (req, res) => {
    const { user } = req.body;
    try {
      const balances = await this.userManager.getBalances(user);
      res.json({ balances });
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
