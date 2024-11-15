import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class OrderLine extends Model {}

OrderLine.init(
  {
    price_ht_at_order: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  { sequelize, tableName: 'order_line' },
);
