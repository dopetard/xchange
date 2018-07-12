import Bluebird from 'bluebird';
import DB from '../db/DB';
import UserManagerRepository from './UserManagerRepository';
import { CurrencyInstance } from '../types/DB';

class UserManager {

  private userRepo: UserManagerRepository;
  private currencies!: CurrencyInstance[];

  constructor(db: DB) {
    this.userRepo = new UserManagerRepository(db);
  }

  public init = async () => {
    this.currencies = await this.userRepo.getCurrencies();
  }

  public addUser = async (): Promise<string> => {
    const { id } = await this.userRepo.addUser();

    const promises: Bluebird<any>[] = [];
    for (const currency of this.currencies) {
      promises.push(this.userRepo.addBalance({
        user: id,
        currency: currency.id,
        balance: 0,
      }));
    }
    await Promise.all(promises);

    return id;
  }

  public updateBalance = async (user: string, currency: string, changedBalance: number) => {
    await this.userRepo.updateUserBalance(user, currency, changedBalance);
  }
}

export default UserManager;
