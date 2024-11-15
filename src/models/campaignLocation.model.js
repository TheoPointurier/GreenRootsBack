import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class CampaignLocation extends Model {}

CampaignLocation.init({
  name_location: {
    type: DataTypes.STRING,
    allowNull: false
   },
   
   
}, { sequelize, tableName: "campaign_locations" });