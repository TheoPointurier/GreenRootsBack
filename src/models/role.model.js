import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Role extends Model {}

Role.init({
  name: {
   type: DataTypes.STRING,
   allowNull: false,
   unique: true
  },
  role_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },   
},{
sequelize,
tableName: "roles"
});