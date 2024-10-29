import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";


export class Country extends Model {}

Country.init({
    name: {
     type: DataTypes.STRING,
     allowNull: false
    },
},{
  sequelize,
  tableName: "country"
});