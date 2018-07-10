import uuidv1 from 'uuid/v1';
import Bluebird from 'bluebird';
import * as db from '../types/DB';
import Db, { Models } from '../db/DB';

class UserRepository {

  private models: Models;

  constructor(db: Db) {
    this.models = db.models;
  }

  public addUser = (): Bluebird<db.UserInstance> => {
    return this.models.User.create({ id: uuidv1() });
  }

  public getUsers = async (): Promise<db.UserInstance[]> => {
    return this.models.User.findAll({ raw: true });
  }

}

export default UserRepository;
