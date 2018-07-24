import Sequelize from 'sequelize';
import * as db from '../../types/DB';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.CurrencyAttributes> = {
    id: { type: DataTypes.STRING, primaryKey: true },
    tokenAddress: { type: DataTypes.STRING, allowNull: true },
  };

  const options: Sequelize.DefineOptions<db.CurrencyInstance> = {
    tableName: `currencies`,
    timestamps: false,
  };

  return sequelize.define<db.CurrencyInstance, db.CurrencyAttributes>('Currency', attributes, options);
};
