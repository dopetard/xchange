import Sequelize, { Op } from 'sequelize';
import * as db from '../types/DB';
import { getPairId } from '../Utils';

class HistoryManagerRepository {

  constructor(private models: Sequelize.Models) {}

  public addHistory = (history: db.HistoryFactory) => {
    return this.models.History.create(history);
  }

  public updateHistory = (history: db.HistoryFactory) => {
    return this.models.History.update(history, {
      where: {
        id: {
          [Op.eq]: getPairId(history.base, history.quote),
        },
      },
    });
  }

  public getHistories = async (): Promise<db.HistoryInstance[]> => {
    return this.models.History.findAll({ raw: true });
  }
}

export default HistoryManagerRepository;
