import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Campaign extends Model {}

Campaign.init({
    name: {
     type: DataTypes.STRING,
     allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start_campaign: {
      type: DataTypes.DATE,
      allowNull: true  
    },
    end_campaign: {
      type: DataTypes.DATE,
      allowNull: true 
    },   
},{
  sequelize,
  tableName: "campaigns"
});