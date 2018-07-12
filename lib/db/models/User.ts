import Sequelize from 'sequelize';
import * as db from '../../types/DB';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.UserAttributes> = {
    id: { type: DataTypes.STRING, primaryKey: true },
  };

  const options: Sequelize.DefineOptions<db.UserInstance> = {
    tableName: 'users',
    timestamps: false,
  };

  return sequelize.define<db.UserInstance, db.UserAttributes>('User', attributes, options);
};
