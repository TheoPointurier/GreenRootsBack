import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";


export class Review extends Model {}

Review.init({
    content: {
     type: DataTypes.TEXT,
     allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    
},{
  sequelize,
  tableName: "reviews"
});