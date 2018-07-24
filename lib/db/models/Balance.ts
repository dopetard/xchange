import Sequelize from 'sequelize';
import * as db from '../../types/DB';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.BalanceAttributes> = {
    user: { type: DataTypes.STRING, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    balance: { type: DataTypes.INTEGER, allowNull: false },
  };

  const options: Sequelize.DefineOptions<db.BalanceInstance> = {
    tableName: `balances`,
    timestamps: false,
  };

  const Balance = sequelize.define<db.BalanceInstance, db.BalanceAttributes>('Balance', attributes, options);

  Balance.associate = (models: Sequelize.Models) => {
    models.Balance.belongsTo(models.User, {
      foreignKey: 'user',
    });

    models.Balance.belongsTo(models.Currency, {
      foreignKey: 'currency',
    });
  };

  return Balance;
};
