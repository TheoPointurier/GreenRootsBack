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
INSERT INTO users (firstname, lastname, email, password, phone_number, street_number, street, city, postal_code, country, entity_name, entity_type, entity_siret, id_role, is_admin) VALUES
('Alice', 'Dupont', 'alice@example.com', 'motdepasse1', 123456789, 12, 'Rue de Paris', 'Paris', '75001', 'France', NULL, 'particulier', NULL, 1, FALSE),
('Bob', 'Martin', 'bob@example.com', 'motdepasse2', 987654321, 56, 'Rue de Lyon', 'Lyon', '69000', 'France', 'Association Verte', 'association', '12345678901234', 2, FALSE),
('Charlie', 'Dupuis', 'charlie@example.com', 'motdepasse3', 543216789, 78, 'Main St', 'New York', '10001', 'États-Unis', NULL, 'particulier', NULL, 1, FALSE),
('Daisy', 'Durand', 'daisy@example.com', 'motdepasse4', 876543219, 22, 'Elm St', 'Los Angeles', '90001', 'États-Unis', 'Green Earth Ltd', 'entreprise', '98765432109876', 3, FALSE),
('Etienne', 'GreenRoots', 'greenroots@oclock.io', 'motdepasse1', 123456789, 12, 'Rue de Paris', 'Paris', '75001', 'France', NULL, 'particulier', NULL, 1, TRUE);


-- Création des avis
INSERT INTO reviews (content, rating, id_user) VALUES
('Projet incroyable, très heureuse de contribuer !', 5, 1),
('Belle initiative, j’espère qu’elle réussira !', 4, 2),
('J’adore le concept et la réalisation.', 5, 3),
('GreenRoots m a permis de contribuer rapidement à un geste responsable', 3, 4);


-- Création des espèces d'arbres
INSERT INTO tree_species (description, species_name, co2_absorption, average_lifespan) VALUES
('Croissance rapide, absorption élevée de CO2', 'Eucalyptus', 40, 60),
('Résistant et à une longue durée de vie', 'Chêne', 30, 100),
('Arbre majestueux à grande hauteur', 'Séquoia', 50, 2000),
('Symbolise la longévité, produit des rameaux aériens', 'Banyan', 40, 200),
('Bois précieux pour mobilier, stockage élevé de carbone', 'Acajou', 35, 80),
('Populaire pour le sirop d’érable, feuilles caduques', 'Érable', 25, 100),
('Adapté aux climats froids, résistant', 'Pin', 30, 150),
('Produit de l’huile d’olive, résistant à la sécheresse', 'Olivier', 20, 500),
('Bois durable et résistant, utilisé en construction', 'Teck', 33, 100),
('Bois léger, à croissance rapide', 'Balsa', 15, 30);


-- Création des arbres avec des âges réalistes
INSERT INTO trees (name, price_ht, quantity, age, id_species) VALUES
('Eucalyptus Bleuté', 12.00, 300, 3, 1),                  -- Eucalyptus
('Chêne Blanc', 18.50, 200, 5, 2),                        -- Chêne
('Séquoia Géant', 70.00, 25, 50, 3),                      -- Séquoia
('Banian de l''Inde', 30.00, 40, 15, 4),                  -- Banyan
('Acajou des Tropiques', 45.00, 100, 10, 5),              -- Acajou
('Érable Sucre', 25.00, 150, 6, 6),                       -- Érable
('Pin d''Écosse', 14.50, 600, 4, 7),                      -- Pin
('Olivier Méditerranéen', 55.00, 80, 20, 8),              -- Olivier
('Teck d''Asie', 50.00, 70, 8, 9),                        -- Teck
('Balsa du Pérou', 10.00, 500, 2, 10),                    -- Balsa
('Chêne Rouge', 20.00, 150, 7, 2),                        -- Chêne
('Acajou du Honduras', 42.00, 90, 6, 5),                  -- Acajou
('Pin Blanc', 13.00, 400, 3, 7),                          -- Pin
('Séquoia Céleste', 75.00, 30, 60, 3),                    -- Séquoia
('Olivier Sauvage', 50.00, 100, 25, 8);                   -- Olivier


-- Localisations de campagnes
INSERT INTO campaign_locations (name_location, id_country) VALUES
('Forêt Amazonienne', 3),  -- Brésil
('Paris', 1),              -- France
('Berlin', 2),             -- Allemagne
('Sydney', 8),             -- Australie
('Nairobi', 13),           -- Kenya
('Central Park, NYC', 4),  -- États-Unis
('Barcelone', 15);         -- Espagne


-- Création des campagnes
INSERT INTO campaigns (name, description, start_campaign, end_campaign, id_location) VALUES
('Reforestation Amazonie', 'Projet de replantation d’arbres en Amazonie', '2024-01-01', '2025-01-01', 1),
('Plantation de Forêts Urbaines', 'Plantation d’arbres dans les villes françaises', '2024-03-01', '2024-12-01', 2),
('Restauration de la faune', 'Restauration d’habitats fauniques en Allemagne', '2023-05-01', '2024-05-01', 3),
('Reforestation', 'Projet pour lutter contre la déforestation en Australie', '2024-07-01', '2025-07-01', 4),
('Restauration de la Savane Africaine', 'Replantation d’espèces natives au Kenya', '2023-06-01', '2024-06-01', 5),
('Espaces Verts', 'Ajout d’espaces verts à New York', '2023-08-01', '2024-08-01', 6),
('Reforestation des Forêts Méditerranéennes', 'Retour des arbres dans le Sud de l’Europe', '2023-09-01', '2024-09-01', 7);


-- Ajout des relations entre les campagnes et les arbres
INSERT INTO campaign_trees (id_campaign, id_tree) VALUES
(1, 1), (1, 5),             -- Campagne 1 avec arbres 1 et 5
(2, 1), (2, 4),             -- Campagne 2 avec arbres 1 et 4
(3, 2), (3, 3),             -- Campagne 3 avec arbres 2 et 3
(4, 4), (4, 5),             -- Campagne 4 avec arbres 4 et 5
(5, 3), (5, 8),             -- Campagne 5 avec arbres 3 et 8
(6, 6), (6, 11), (6, 7),    -- Campagne 6 avec arbres 6, 11, et 7
(7, 4), (7, 9), (7, 13), (7, 10); -- Campagne 7 avec 4 arbres différents


-- Favoris (campagnes sauvegardées)
INSERT INTO bookmarks (id_user, id_campaign) VALUES
(1, 1), (1, 2), (1, 3),
(2, 4), (2, 5), (2, 6),
(3, 7), (4, 1), (4, 2);


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
(30.00, 4, 120.00, 7, 13, 7),   -- CMD007 pour Campagne 7, Arbre 13
(12.00, 5, 60.00, 8, 9, 5),      -- CMD008 pour Campagne 8, Arbre 9
(22.50, 3, 67.50, 8, 7, 5),      -- CMD008 pour Campagne 8, Arbre 7
(25.30, 5, 126.50, 9, 10, 5),    -- CMD009 pour Campagne 9, Arbre 10
(18.00, 7, 126.00, 9, 5, 6),     -- CMD009 pour Campagne 9, Arbre 5
(15.50, 4, 62.00, 10, 12, 6),   -- CMD010 pour Campagne 10, Arbre 12
(20.00, 5, 100.00, 10, 8, 7);   -- CMD010 pour Campagne 10, Arbre 8


COMMIT;



