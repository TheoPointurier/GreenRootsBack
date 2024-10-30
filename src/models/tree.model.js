import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Tree extends Model {}

Tree.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
   },
   price_ht: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
   },
   quantity: {
    type: DataTypes.INTEGER,
    allowNull: true
   },
   age: {
    type: DataTypes.INTEGER,
    allowNull: false
   },

}, { sequelize, tableName: "trees" });