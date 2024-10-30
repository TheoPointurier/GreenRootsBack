import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";


export class TreeSpecies extends Model {}

TreeSpecies.init({
    description: {
     type: DataTypes.TEXT,
     allowNull: true
    },
    species_name: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    co2_absorption: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    average_lifespan: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
    
},{
  sequelize,
  tableName: "tree_species"
});