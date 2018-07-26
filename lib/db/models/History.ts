import Sequelize from 'sequelize';
import * as db from '../../types/DB';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.HistoryAttributes> = {
    id: { type: DataTypes.STRING, primaryKey: true },
    base: { type: DataTypes.STRING, allowNull: false },
    quote: { type: DataTypes.STRING, allowNull: false },
    hour: { type: DataTypes.STRING },
    day: { type: DataTypes.STRING },
    week: { type: DataTypes.STRING },
    month: { type: DataTypes.STRING },
    threeMonths: { type: DataTypes.STRING },
    year: { type: DataTypes.STRING },
    twoYears: { type: DataTypes.STRING },
  };

  const options: Sequelize.DefineOptions<db.HistoryInstance> = {
    tableName: `history`,
    timestamps: false,
  };

  const History = sequelize.define<db.HistoryInstance, db.HistoryAttributes>('History', attributes, options);

  History.associate = (models: Sequelize.Models) => {
    models.History.belongsTo(models.Currency, {
      foreignKey: 'base',
    });

    models.History.belongsTo(models.Currency, {
      foreignKey: 'quote',
    });

    const derivePairId = (pair) => {
      pair.id = `${pair.base}/${pair.quote}`;
    };
    models.History.beforeBulkCreate(histories => histories.forEach(history => derivePairId(history)));
    models.History.beforeCreate(history => derivePairId(history));
  };

  return History;
};
