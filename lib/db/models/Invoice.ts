import Sequelize from 'sequelize';
import * as db from '../../types/DB';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.InvoiceAttributes> = {
    identifier: { type: DataTypes.STRING, primaryKey: true },
    user: { type: DataTypes.STRING, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
  };

  const options: Sequelize.DefineOptions<db.InvoiceInstance> = {
    tableName: `invoices`,
    timestamps: false,
  };

  const Invoice =  sequelize.define<db.InvoiceInstance, db.InvoiceAttributes>('Invoice', attributes, options);

  Invoice.associate = (models: Sequelize.Models) => {
    models.Invoice.belongsTo(models.User, {
      foreignKey: 'user',
    });

    models.Invoice.belongsTo(models.Currency, {
      foreignKey: 'currency',
    });
  };

  return Invoice;
};
