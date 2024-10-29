CREATE TABLE [roles] (
	[id_role] int IDENTITY(1,1) NOT NULL,
	[name] nvarchar(20) NOT NULL UNIQUE,
	[role_description] nvarchar(100) NOT NULL,
	[created_at] rowversion NOT NULL,
	[updated_at] rowversion NOT NULL,
	PRIMARY KEY ([id_role])
);

CREATE TABLE [users] (
	[id_user] int IDENTITY(1,1) NOT NULL,
	[firstname] nvarchar(255) NOT NULL,
	[lastname] nvarchar(255) NOT NULL,
	[email] nvarchar(255) NOT NULL UNIQUE,
	[password] nvarchar(60) NOT NULL,
	[phone_number] int,
	[street_number] int NOT NULL,
	[street] nvarchar(255) NOT NULL,
	[city] nvarchar(100) NOT NULL,
	[postal_code] nvarchar(10) NOT NULL,
	[country] nvarchar(100) NOT NULL,
	[entity_name] nvarchar(255),
	[entity_type] nvarchar(50) NOT NULL,
	[entity_siret] nvarchar(14),
	[created_at] rowversion NOT NULL,
	[updated_at] rowversion NOT NULL,
	[id_role] int NOT NULL,
	PRIMARY KEY ([id_user])
);

CREATE TABLE [reviews] (
	[id_review] int IDENTITY(1,1) NOT NULL,
	[content] nvarchar(255) NOT NULL,
	[rating] int NOT NULL,
	[created_at] rowversion NOT NULL,
	[updated_at] rowversion NOT NULL,
	[id_user] int NOT NULL,
	PRIMARY KEY ([id_review])
);

CREATE TABLE [bookmarks] (
	[id_bookmark] int IDENTITY(1,1) NOT NULL,
	[id_user] int NOT NULL,
	[id_campaign] int NOT NULL,
	PRIMARY KEY ([id_bookmark])
);

CREATE TABLE [TreeSpecies] (
	[description] nvarchar(max) NOT NULL,
	[id_species] int IDENTITY(1,1) NOT NULL,
	[species_name] nvarchar(255) NOT NULL UNIQUE,
	[co2_absorption] float(53) NOT NULL,
	[average_lifespan] int NOT NULL,
	PRIMARY KEY ([id_species])
);

CREATE TABLE [Trees] (
	[id_tree] int IDENTITY(1,1) NOT NULL,
	[name] nvarchar(255) NOT NULL,
	[price_HT] float(53) NOT NULL,
	[quantity] int,
	[age] int NOT NULL,
	[created_at] rowversion NOT NULL,
	[updated_at] rowversion NOT NULL,
	[id_species] int NOT NULL,
	PRIMARY KEY ([id_tree])
);

CREATE TABLE [Campaigns] (
	[id_campaign] int IDENTITY(1,1) NOT NULL,
	[name] nvarchar(255) NOT NULL,
	[description] nvarchar(max) NOT NULL,
	[start_campaign] rowversion NOT NULL,
	[end_campaign] rowversion NOT NULL,
	[created_at] rowversion NOT NULL,
	[updated_at] rowversion NOT NULL,
	[id_tree] int NOT NULL,
	PRIMARY KEY ([id_campaign])
);

CREATE TABLE [CampaignLocations] (
	[id_location] int IDENTITY(1,1) NOT NULL,
	[location] nvarchar(255) NOT NULL,
	[id_campaign] int NOT NULL,
	[id_country] int NOT NULL,
	PRIMARY KEY ([id_location])
);

CREATE TABLE [Country] (
	[id_country] int IDENTITY(1,1) NOT NULL,
	[name] nvarchar(100) NOT NULL UNIQUE,
	PRIMARY KEY ([id_country])
);

CREATE TABLE [Orders] (
	[id_order] int IDENTITY(1,1) NOT NULL,
	[total_amount] float(53) NOT NULL,
	[status] nvarchar(50) NOT NULL,
	[order_number] nvarchar(50) NOT NULL UNIQUE,
	[id_user] int NOT NULL,
	[created_at] rowversion NOT NULL,
	[updated_at] rowversion NOT NULL,
	PRIMARY KEY ([id_order])
);

CREATE TABLE [OrderDetails] (
	[id_detail] int IDENTITY(1,1) NOT NULL,
	[price_HT_at_order] float(53) NOT NULL,
	[quantity] int NOT NULL,
	[total_amount] float(53) NOT NULL,
	[name] nvarchar(255) NOT NULL,
	[id_order] int NOT NULL,
	[id_tree] int NOT NULL,
	[created_at] rowversion NOT NULL,
	[updated_at] rowversion NOT NULL,
	PRIMARY KEY ([id_detail])
);


ALTER TABLE [users] ADD CONSTRAINT [users_fk16] FOREIGN KEY ([id_role]) REFERENCES [roles]([id_role]);
ALTER TABLE [reviews] ADD CONSTRAINT [reviews_fk5] FOREIGN KEY ([id_user]) REFERENCES [users]([id_user]);
ALTER TABLE [bookmarks] ADD CONSTRAINT [bookmarks_fk1] FOREIGN KEY ([id_user]) REFERENCES [users]([id_user]);

ALTER TABLE [bookmarks] ADD CONSTRAINT [bookmarks_fk2] FOREIGN KEY ([id_campaign]) REFERENCES [Campaigns]([id_campaign]);

ALTER TABLE [Trees] ADD CONSTRAINT [Trees_fk7] FOREIGN KEY ([id_species]) REFERENCES [TreeSpecies]([id_species]);
ALTER TABLE [Campaigns] ADD CONSTRAINT [Campaigns_fk7] FOREIGN KEY ([id_tree]) REFERENCES [Trees]([id_tree]);
ALTER TABLE [CampaignLocations] ADD CONSTRAINT [CampaignLocations_fk2] FOREIGN KEY ([id_campaign]) REFERENCES [Campaigns]([id_campaign]);

ALTER TABLE [CampaignLocations] ADD CONSTRAINT [CampaignLocations_fk3] FOREIGN KEY ([id_country]) REFERENCES [Country]([id_country]);

ALTER TABLE [Orders] ADD CONSTRAINT [Orders_fk4] FOREIGN KEY ([id_user]) REFERENCES [users]([id_user]);
ALTER TABLE [OrderDetails] ADD CONSTRAINT [OrderDetails_fk5] FOREIGN KEY ([id_order]) REFERENCES [Orders]([id_order]);

ALTER TABLE [OrderDetails] ADD CONSTRAINT [OrderDetails_fk6] FOREIGN KEY ([id_tree]) REFERENCES [Trees]([id_tree]);