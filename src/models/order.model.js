import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Order extends Model {}

Order.init({
  total_amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
   },
   status: {
    type: DataTypes.STRING,
    allowNull: false
   },
   order_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
   },
   
}, { sequelize, tableName: "orders" });