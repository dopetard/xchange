import { Models } from '../db/Database';
import * as db from '../consts/Database';

class UtxoRepository {
  constructor(private models: Models) {}

  public getUtxos = async (currency: string) => {
    return this.models.Utxo.findAll({
      where: {
        currency,
      },
    });
  }

  public getUtxosSorted = async (currency: string) => {
    return this.models.Utxo.findAll({
      where: {
        currency,
      },
      order: [
        ['value', 'DESC'],
      ],
    });
  }

  public getUtxo = async (txHash: string) => {
    return this.models.Utxo.findAll({
      where: {
        txHash,
      },
    });
  }

  public addUtxo = async (utxo: db.UtxoFactory) => {
    return this.models.Utxo.create(utxo);
  }

  public removeUtxo = async (txHash: string) => {
    return this.models.Utxo.destroy({
      where: {
        txHash,
      },
    });
  }
}

export default UtxoRepository;
