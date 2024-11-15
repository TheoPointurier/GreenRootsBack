import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class User extends Model {}

User.init(
  {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNul: false,
    },
    phone_number: {
      type: DataTypes.INTEGER,
      allowNul: true,
    },
    street_number: {
      type: DataTypes.INTEGER,
      allowNul: false,
    },
    street: {
      type: DataTypes.STRING,
      allowNul: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNul: false,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNul: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNul: false,
    },
    entity_name: {
      type: DataTypes.STRING,
      allowNul: true,
    },
    entity_type: {
      type: DataTypes.STRING,
      allowNul: true,
    },
    entity_siret: {
      type: DataTypes.STRING,
      allowNul: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNul: false,
    },
  },
  { sequelize, tableName: 'users' },
);
