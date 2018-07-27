import Sequelize, { DataTypeAbstract, DefineAttributeColumnOptions } from 'sequelize';

export type SequelizeAttributes<T extends { [key: string]: any }> = {
  [P in keyof T]: string | DataTypeAbstract | DefineAttributeColumnOptions
};

/*
* The following definitions are in sets of triplets, one for each Model (which represents a table in the database).
*
* "xFactory" is the type definition for the object which is required when a new record is to be created.
*
* "xAttributes" is the type definition of the record. It cannot support nullables, as it is being used for the table's columns definition.
*
* "xInstance" is the type definition of a fetched record as a Sequelize row instance, which contains some util properties.
*/

export type UserFactory = {
  id: string,
};

export type UserAttributes = UserFactory;

export type UserInstance = UserAttributes & Sequelize.Instance<UserAttributes>;

export type CurrencyFactory = {
  id: string,
  tokenAddress: string | null,
};

export type CurrencyAttributes = CurrencyFactory;
export type CurrencyInstance = CurrencyAttributes & Sequelize.Instance<CurrencyAttributes>;

export type BalanceFactory = {
  user: string,
  currency: string,
  balance: number | Sequelize.literal,
};

export type BalanceAttributes = BalanceFactory;
export type BalanceInstance = BalanceAttributes & Sequelize.Instance<BalanceAttributes>;

export type InvoiceFactory = {
  identifier: string,
  user: string,
  currency: string,
};

export type InvoiceAttributes = InvoiceFactory;
export type InvoiceInstance = InvoiceAttributes & Sequelize.Instance<InvoiceAttributes>;

export type HistoryFactory = {
  base: string,
  quote: string,
  hour?: string,
  day?: string,
  week?: string,
  month?: string,
  threeMonths?: string,
  year?: string,
  twoYears?: string,
};

export type HistoryAttributes = {
  id: string,
  base: string,
  quote: string,
  hour: string,
  day: string,
  week: string,
  month: string,
  threeMonths: string,
  year: string,
  twoYears: string,
};

export type HistoryInstance = HistoryAttributes & Sequelize.Instance<HistoryAttributes>;
