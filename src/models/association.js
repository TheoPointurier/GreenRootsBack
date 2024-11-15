import { User } from './user.model.js';
import { Tree } from './tree.model.js';
import { Campaign } from './campaign.model.js';
import { Role } from './role.model.js';
import { Country } from './country.model.js';
import { Review } from './review.model.js';
import { TreeSpecies } from './treeSpecies.model.js';
import { OrderLine } from './orderLine.model.js';
import { Order } from './order.model.js';
import { CampaignLocation } from './campaignLocation.model.js';
import { sequelize } from './sequelize-client.js';

//Association role et user
Role.hasMany(User, {
  as: 'users',
  foreignKey: {
    name: 'id_role',
    allowNull: true,
  },
});

User.belongsTo(Role, {
  as: 'role',
  foreignKey: {
    name: 'id_role',
    allowNull: false,
  },
});

//Association user et review
User.hasMany(Review, {
  as: 'reviews',
  foreignKey: {
    name: 'id_user',
    allowNull: true,
  },
  onDelete: 'CASCADE',
});

Review.belongsTo(User, {
  as: 'user',
  foreignKey: {
    name: 'id_user',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

//Association treeSpecies et trees
TreeSpecies.hasMany(Tree, {
  as: 'trees',
  foreignKey: {
    name: 'id_species',
    allowNull: true,
  },
});

Tree.belongsTo(TreeSpecies, {
  as: 'species',
  foreignKey: {
    name: 'id_species',
    allowNull: false,
  },
});

// Association entre campagne et trees via table liaison (campaign_trees)
Campaign.belongsToMany(Tree, {
  through: 'campaign_trees',
  as: 'treesCampaign',
  foreignKey: 'id_campaign',
  otherKey: 'id_tree',
  onDelete: 'CASCADE',
});

Tree.belongsToMany(Campaign, {
  through: 'campaign_trees',
  as: 'campaignTree',
  foreignKey: 'id_tree',
  otherKey: 'id_campaign',
  onDelete: 'CASCADE',
});

// Assoctiation entre User et Campagne via table liaison (bookmarks)
User.belongsToMany(Campaign, {
  through: 'bookmarks',
  as: 'bookmarksUser',
  foreignKey: 'id_user',
  otherKey: 'id_campaign',
  onDelete: 'CASCADE',
});

Campaign.belongsToMany(User, {
  through: 'bookmarks',
  as: 'bookmarksCampaign',
  foreignKey: 'id_campaign',
  otherKey: 'id_user',
  onDelete: 'CASCADE',
});

// Association entre Country et Campaign Location
Country.hasMany(CampaignLocation, {
  as: 'locations',
  foreignKey: {
    name: 'id_country',
    allowNull: true,
  },
});

CampaignLocation.belongsTo(Country, {
  as: 'country',
  foreignKey: {
    name: 'id_country',
    allowNull: false,
  },
});

// Association entre Campagne et Campagne Location
CampaignLocation.hasMany(Campaign, {
  as: 'campaigns',
  foreignKey: {
    name: 'id_location',
    allowNull: true,
  },
});

Campaign.belongsTo(CampaignLocation, {
  as: 'location',
  foreignKey: {
    name: 'id_location',
    allowNull: true,
  },
});

// Association entre orders et user
User.hasMany(Order, {
  as: 'orders',
  foreignKey: {
    name: 'id_user',
    allowNull: true,
  },
});

Order.belongsTo(User, {
  as: 'user',
  foreignKey: {
    name: 'id_user',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

// Association entre orders et orderLines
Order.hasMany(OrderLine, {
  as: 'orderLines',
  foreignKey: {
    name: 'id_order',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

OrderLine.belongsTo(Order, {
  as: 'order',
  foreignKey: {
    name: 'id_order',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

// Association entre trees et orderLines
Tree.hasMany(OrderLine, {
  as: 'orderLines',
  foreignKey: {
    name: 'id_tree',
    allowNull: true,
  },
  onDelete: 'CASCADE',
});

OrderLine.belongsTo(Tree, {
  as: 'tree',
  foreignKey: {
    name: 'id_tree',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

// Association entre campaign et orderLines
Campaign.hasMany(OrderLine, {
  as: 'orderLines',
  foreignKey: {
    name: 'id_campaign',
    allowNull: true,
  },
  onDelete: 'CASCADE',
});

OrderLine.belongsTo(Campaign, {
  as: 'campaign',
  foreignKey: {
    name: 'id_campaign',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

export {
  User,
  Tree,
  Campaign,
  CampaignLocation,
  Role,
  Country,
  Review,
  TreeSpecies,
  OrderLine,
  Order,
  sequelize,
};
