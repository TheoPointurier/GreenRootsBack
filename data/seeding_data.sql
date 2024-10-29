BEGIN;


-- Création des rôles
INSERT INTO roles (name, role_description) VALUES
('particulier', 'Utilisateur individuel'),
('association', 'Association engagée dans la reforestation'),
('entreprise', 'Entreprise sponsorisant la reforestation');

-- Création des pays
INSERT INTO country (name) VALUES
('France'), ('Allemagne'), ('Brésil'), ('États-Unis'), ('Canada'),
('Inde'), ('Japon'), ('Australie'), ('Afrique du Sud'), ('Mexique'),
('Argentine'), ('Pérou'), ('Kenya'), ('Thaïlande'), ('Italie'),
('Espagne'), ('Portugal'), ('Suède'), ('Norvège'), ('Nouvelle-Zélande');

-- Création des utilisateurs
INSERT INTO users (firstname, lastname, email, password, phone_number, street_number, street, city, postal_code, country, entity_name, entity_type, entity_siret, id_role) VALUES
('Alice', 'Dupont', 'alice@example.com', 'motdepasse1', 123456789, 12, 'Rue de Paris', 'Paris', '75001', 'France', NULL, 'particulier', NULL, 1),
('Bob', 'Martin', 'bob@example.com', 'motdepasse2', 987654321, 56, 'Rue de Lyon', 'Lyon', '69000', 'France', 'Association Verte', 'association', '12345678901234', 2),
('Charlie', 'Dupuis', 'charlie@example.com', 'motdepasse3', 543216789, 78, 'Main St', 'New York', '10001', 'États-Unis', NULL, 'particulier', NULL, 1),
('Daisy', 'Durand', 'daisy@example.com', 'motdepasse4', 876543219, 22, 'Elm St', 'Los Angeles', '90001', 'États-Unis', 'Green Earth Ltd', 'entreprise', '98765432109876', 3);

-- Création des avis
INSERT INTO reviews (content, rating, id_user) VALUES
('Projet incroyable, très heureuse de contribuer !', 5, 1),
('Belle initiative, j’espère qu’elle réussira !', 4, 2),
('J’adore le concept et la réalisation.', 5, 3),
('GreenRoots m a permis de contribuer rapidement à un geste responsable', 3, 4);

-- Création des espèces d'arbres
INSERT INTO tree_species (description, species_name, co2_absorption, average_lifespan) VALUES
('Croissance rapide, absorption élevée de CO2', 'Eucalyptus', 40, 60),
('Résistant et à longue durée de vie', 'Chêne', 30, 100),
('Espèce exotique avec un stockage élevé de carbone', 'Acajou', 50, 150),
('Arbre commun, adaptable à de nombreux environnements', 'Pin', 35, 70),
('Originaire du Brésil, absorption élevée de CO2', 'Bois de rose', 45, 90),
('Arbre tropical, utile pour l’ombrage', 'Balsa', 20, 30),
('Arbre fruitier à croissance rapide', 'Manguier', 25, 40),
('Absorption de CO2 modérée, longue durée de vie', 'Érable', 28, 80),
('Arbre des zones humides, croissance rapide', 'Saule', 35, 60),
('Conifère à haute absorption', 'Sapin', 33, 70),
('Absorption modérée, grande résistance', 'Frêne', 30, 70),
('Arbre exotique d’ornement', 'Banyan', 40, 150),
('Arbre de montagne', 'Cèdre', 38, 120),
('Arbre à croissance rapide en zone tropicale', 'Teck', 42, 80),
('Absorption élevée, résistant à la sécheresse', 'Olive', 20, 200),
('Absorption de CO2 importante', 'Séquoia', 45, 200),
('Arbre de climat tempéré', 'Hêtre', 29, 100),
('Arbre à bois dur, grande longévité', 'Noyer', 27, 90),
('Arbre à croissance lente', 'Châtaignier', 25, 80),
('Arbre ornemental pour zones urbaines', 'Prunus', 18, 30),
('Arbre résistant aux climats froids', 'Épinette', 32, 80),
('Croissance rapide, bois résistant', 'Acacia', 28, 60),
('Absorption de CO2 élevée en zones arides', 'Caroubier', 26, 50),
('Arbre méditerranéen', 'Myrte', 22, 40),
('Croissance rapide en région chaude', 'Neem', 33, 60),
('Arbre fruitier tropical', 'Papayer', 18, 25),
('Absorption élevée de CO2, bois dense', 'Merisier', 30, 70),
('Arbre de climat chaud, croissance rapide', 'Palmier dattier', 25, 100),
('Arbre de forêt humide', 'Caoutchouc', 34, 60),
('Bois dur et dense', 'Iroko', 37, 80),
('Arbre à croissance lente et durable', 'Buis', 15, 40),
('Arbre ornemental', 'Jacaranda', 28, 50),
('Bois de haute qualité', 'Acajou Africain', 42, 80),
('Arbre de montagne, croissance lente', 'If', 40, 200),
('Conifère de haute montagne', 'Mélèze', 33, 120),
('Arbre résistant en zone tropicale', 'Ipé', 40, 80),
('Arbre sacré en Inde', 'Banian', 30, 150),
('Arbre pour restauration des sols', 'Cassia', 25, 40),
('Bois précieux', 'Ébène', 42, 100),
('Arbre fruitier à usage commercial', 'Citronnier', 20, 50),
('Espèce ornementale', 'Ficus', 18, 40),
('Bois dense, utilisé en construction', 'Bambou', 35, 25),
('Arbre de zones marécageuses', 'Cyprès', 32, 60),
('Arbre fruitier des zones tropicales', 'Avocatier', 26, 50),
('Arbre de climat tempéré', 'Orme', 29, 70),
('Absorption élevée de CO2 en altitude', 'Pin Sylvestre', 30, 60),
('Arbre typique des zones arides', 'Tamaris', 25, 40),
('Arbre à croissance rapide', 'Paulownia', 40, 40),
('Absorption élevée, utilisé en bois de chauffage', 'Aulne', 35, 50);

-- Création des arbres
INSERT INTO trees (name, price_ht, quantity, age, id_species) VALUES
('Eucalyptus Hybride', 15.50, 500, 2, 1),
('Chêne Rouge', 20.00, 200, 5, 2),
('Acajou des Caraïbes', 35.00, 150, 10, 3),
('Pin d’Écosse', 12.50, 600, 3, 4),
('Spécimen de Bois de rose', 50.00, 50, 8, 5),
('Balsa Standard', 8.00, 700, 1, 6),
('Manguier Africain', 12.00, 120, 4, 7),
('Érable Royal', 22.00, 300, 7, 8),
('Saule Pleureur', 15.00, 400, 3, 9),
('Sapin Noble', 17.00, 250, 5, 10),
('Frêne Commun', 18.00, 350, 6, 11),
('Banyan Sacré', 40.00, 50, 15, 12),
('Cèdre du Liban', 30.00, 100, 12, 13),
('Teck Indonésien', 45.00, 80, 9, 14),
('Olivier Méditerranéen', 60.00, 30, 50, 15),
('Séquoia Géant', 80.00, 20, 100, 16),
('Hêtre Commun', 25.00, 200, 5, 17),
('Noyer Noir', 32.00, 150, 10, 18),
('Châtaignier Européen', 20.00, 300, 8, 19),
('Prunus d’ornement', 12.00, 400, 2, 20);


-- Création des campagnes
INSERT INTO campaigns (name, description, start_campaign, end_campaign) VALUES
('Reforestation Amazonie', 'Projet de replantation d’arbres en Amazonie', '2024-01-01', '2025-01-01'),
('Forêt Urbaine France', 'Plantation d’arbres dans les villes françaises', '2024-03-01', '2024-12-01'),
('Habitat Faunique Allemagne', 'Restauration d’habitats fauniques en Allemagne', '2023-05-01', '2024-05-01'),
('Reverdissement Australie', 'Projet pour lutter contre la déforestation en Australie', '2024-07-01', '2025-07-01'),
('Restauration de la Savane Africaine', 'Replantation d’espèces natives au Kenya', '2023-06-01', '2024-06-01'),
('Espaces Verts NYC', 'Ajout d’espaces verts à New York', '2023-08-01', '2024-08-01'),
('Récupération des Forêts Méditerranéennes', 'Retour des arbres dans le Sud de l’Europe', '2023-09-01', '2024-09-01');

-- Ajout des relations entre les campagnes et les arbres
INSERT INTO campaign_trees (id_campaign, id_tree) VALUES
(1, 1), (1, 5), (1, 7),      -- Campagne 1 avec 3 arbres différents
(2, 1), (2, 4),               -- Campagne 2 avec 2 arbres différents
(3, 2), (3, 3), (3, 6),       -- Campagne 3 avec 3 arbres différents
(4, 2), (4, 4), (4, 10),      -- Campagne 4 avec 3 arbres différents
(5, 3), (5, 8),               -- Campagne 5 avec 2 arbres différents
(6, 6), (6, 11), (6, 7),      -- Campagne 6 avec 3 arbres différents
(7, 4), (7, 9), (7, 13), (7, 10); -- Campagne 7 avec 4 arbres différents

-- Localisations de campagnes
INSERT INTO campaign_locations (name_location, id_country, id_campaign) VALUES
('Forêt Amazonienne', 3, 1),
('Paris', 1, 2),
('Berlin', 2, 3),
('Sydney', 8, 4),
('Nairobi', 13, 5),
('Central Park, NYC', 4, 6),
('Barcelone', 15, 7);

-- Favoris (campagnes sauvegardées)
INSERT INTO bookmarks (id_user, id_campaign) VALUES
(1, 1), (1, 2), (1, 3),
(2, 4), (2, 5), (2, 6);

-- Commandes
INSERT INTO orders (total_amount, status, order_number, id_user) VALUES
(155.00, 'terminée', 'CMD001', 1),
(300.50, 'en attente', 'CMD002', 2),
(75.75, 'expédiée', 'CMD003', 3),
(200.20, 'terminée', 'CMD004', 4),
(90.10, 'en traitement', 'CMD005', 1),
(180.75, 'terminée', 'CMD006', 1),
(225.40, 'en traitement', 'CMD007', 2),
(130.00, 'terminée', 'CMD008', 3),
(250.30, 'expédiée', 'CMD009', 4),
(95.50, 'terminée', 'CMD010', 2);

-- Détails des commandes
INSERT INTO order_line (price_ht_at_order, quantity, total_amount, id_order, id_tree, id_campaign) VALUES
(15.50, 10, 155.00, 1, 1, 1),   -- CMD001 pour Campagne 1, Arbre 1
(20.00, 5, 100.00, 1, 5, 1),    -- CMD001 pour Campagne 1, Arbre 5
(20.00, 15, 300.50, 2, 2, 2),   -- CMD002 pour Campagne 2, Arbre 2
(12.50, 8, 100.00, 2, 4, 2),    -- CMD002 pour Campagne 2, Arbre 4
(12.50, 6, 75.75, 3, 6, 3),     -- CMD003 pour Campagne 3, Arbre 6
(18.00, 4, 72.00, 3, 3, 3),     -- CMD003 pour Campagne 3, Arbre 3
(35.00, 5, 200.20, 4, 2, 4),    -- CMD004 pour Campagne 4, Arbre 2
(10.00, 10, 100.00, 4, 10, 4),  -- CMD004 pour Campagne 4, Arbre 10
(8.00, 11, 90.10, 5, 8, 5),     -- CMD005 pour Campagne 5, Arbre 8
(15.00, 5, 75.00, 5, 3, 5),     -- CMD005 pour Campagne 5, Arbre 3
(18.50, 6, 111.00, 6, 6, 6),    -- CMD006 pour Campagne 6, Arbre 6
(25.25, 4, 101.00, 6, 11, 6),   -- CMD006 pour Campagne 6, Arbre 11
(20.50, 7, 143.50, 7, 4, 7),    -- CMD007 pour Campagne 7, Arbre 4
(30.00, 4, 120.00, 7, 13, 7);   -- CMD007 pour Campagne 7, Arbre 13


COMMIT;
