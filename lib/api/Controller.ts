import UserManager from '../users/UserManager';

// TODO: error handling UserManager
// TODO: error handling not enough arguments
class Controller {

  constructor(private userManager: UserManager) {}

  public addUser = async (_req, res) => {
    const user = await this.userManager.addUser();
    res.json({ user });
  }

  public sendPayment = async (req, res) => {
    const { user, invoice } = req.body;
    console.log(req.body);
    res.json(await this.userManager.sendPayment(user, invoice));
  }

  public getInvoice = async (req, res) => {
    const { user, currency, amount, memo } = req.body;
    res.json(await this.userManager.getInvoice(user, currency, amount, memo));
  }

  public getBalance = async (req, res) => {
    const { user, currency } = req.body;
    const balance = await this.userManager.getBalance(user, currency);
    res.json({ balance });
  }

  public getBalances = async (req, res) => {
    const { user } = req.body;
    const balances = await this.userManager.getBalances(user);
    res.json({ balances });
  }

}

export default Controller;
