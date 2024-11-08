import {
  Campaign,
  CampaignLocation,
  Country,
  Tree,
  TreeSpecies,
} from '../../models/index.js';
import Joi from 'joi';
import { sequelize } from '../../models/index.js';

export async function getAllCampaignBackofice(req, res) {
  try {
    const campaigns = await Campaign.findAll({
      include: [
        {
          model: CampaignLocation,
          as: 'location',
          include: [
            {
              model: Country,
              as: 'country',
            },
          ],
        },
        {
          model: Tree,
          as: 'treesCampaign',
          include: [
            {
              model: TreeSpecies,
              as: 'species',
            },
          ],
        },
      ],
    });
    const trees = await Tree.findAll();
    res.render('campaigns', { campaigns, trees });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function createCampaignBackoffice(req, res) {
  try {
    // Schéma de validation pour la création de la campagne
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow(null, ''),
      start_campaign: Joi.date().iso().allow(null),
      end_campaign: Joi.date().iso().allow(null),
      treesCampaign: Joi.array().items(
        Joi.object({
          id: Joi.number().integer().required(),
        }),
      ),
      location: Joi.object({
        id: Joi.number().integer(),
        name_location: Joi.string(),
        id_country: Joi.number().integer(),
        country: Joi.object({
          id: Joi.number().integer(),
          name: Joi.string(),
        }),
      }),
    });

    // Validation de la requête avec Joi
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    // Extraire les données de la requête
    const {
      name,
      description,
      start_campaign,
      end_campaign,
      treesCampaign,
      location,
    } = req.body;

    // Création de la campagne
    const campaign = await Campaign.create({
      name,
      description,
      start_campaign,
      end_campaign,
    });

    // Gérer les associations de localisation et de pays
    let countryRecord;
    if (location && location.country && location.country.name) {
      const countryNameLower = location.country.name.toLowerCase();
      [countryRecord] = await Country.findOrCreate({
        where: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('name')),
          countryNameLower,
        ),
        defaults: { name: location.country.name }, // Nom avec la casse originale pour l'insertion
      });
    }

    // Création de la localisation avec l'ID du pays
    const campaignLocation = await CampaignLocation.create({
      name_location: location ? location.name_location : null,
      id_country: countryRecord ? countryRecord.id : null,
    });

    // Associer la localisation à la campagne
    await campaign.setLocation(campaignLocation);

    // Gérer les associations d'arbres
    if (treesCampaign && treesCampaign.length > 0) {
      // Vérifier que tous les arbres existent
      const treeIds = treesCampaign.map((tree) => tree.id);
      const existingTrees = await Tree.findAll({
        where: { id: treeIds },
      });

      if (existingTrees.length !== treeIds.length) {
        return res
          .status(400)
          .send({ message: 'Certains arbres fournis n’existent pas' });
      }

      // Associer les arbres à la campagne
      await campaign.setTreesCampaign(treeIds);
    }

    // Récupérer la campagne créée avec ses associations
    const newCampaign = await Campaign.findByPk(campaign.id, {
      include: [
        {
          model: Tree,
          as: 'treesCampaign',
          through: { attributes: [] }, // Pour exclure les champs de la table pivot
        },
        {
          model: CampaignLocation,
          as: 'location',
          include: [
            {
              model: Country,
              as: 'country',
            },
          ],
        },
      ],
    });

    res.redirect('/admin/campaigns');
  } catch (error) {
    console.error('Erreur lors de la création de la campagne:', error);
    res.status(500).send({
      message: 'Erreur lors de la création de la campagne',
      error: error.message,
    });
  }
}

export async function updateCampaignBackOffice(req, res) {
  console.log(req.body);
  try {
    // Schéma de validation pour la mise à jour de la campagne
    const schema = Joi.object({
      name: Joi.string(),
      description: Joi.string().allow(null, ''),
      start_campaign: Joi.date().iso().allow(null),
      end_campaign: Joi.date().iso().allow(null),
      treesCampaign: Joi.array().items(
        Joi.object({
          id: Joi.number().integer().required(),
        }),
      ),
      location: Joi.object({
        id: Joi.number().integer(),
        name_location: Joi.string(),
        id_country: Joi.number().integer(),
        country: Joi.object({
          id: Joi.number().integer(),
          name: Joi.string(),
        }),
      }),
    });

    // Validation de la requête avec Joi
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const campaignId = Number.parseInt(req.params.id, 10);
    const campaign = await Campaign.findByPk(campaignId);

    if (!campaign) {
      return res.status(404).json({
        message: `La campagne avec l'id ${req.params.id} n'a pas été trouvée`,
      });
    }

    // Extraire les données de la requête
    const {
      name,
      description,
      start_campaign,
      end_campaign,
      treesCampaign,
      location,
    } = req.body;

    // Mettre à jour la campagne
    if (name !== undefined) campaign.name = name;
    if (description !== undefined) campaign.description = description;
    if (start_campaign !== undefined) campaign.start_campaign = start_campaign;
    if (end_campaign !== undefined) campaign.end_campaign = end_campaign;
    await campaign.save();

    // Gérer les associations d'arbres
    if (treesCampaign) {
      if (treesCampaign.length > 0) {
        // Vérifier que tous les arbres existent
        const treeIds = treesCampaign.map((tree) => tree.id);
        const existingTrees = await Tree.findAll({
          where: { id: treeIds },
        });

        if (existingTrees.length !== treeIds.length) {
          return res
            .status(400)
            .json({ message: 'Certains arbres fournis n’existent pas' });
        }

        // Mettre à jour les associations
        await campaign.setTreesCampaign(treeIds);
      } else {
        await campaign.setTreesCampaign([]);
      }
    }

    // Gérer les associations de localisation
    if (location) {
      const { id: locationId, name_location, id_country, country } = location;
      let campaignLocation;

      // Cas où locationId est fourni (mise à jour d'une localisation existante)
      if (locationId) {
        campaignLocation = await CampaignLocation.findByPk(locationId);
        if (!campaignLocation) {
          return res.status(404).json({
            message: `La localisation avec l'id ${locationId} n'a pas été trouvée`,
          });
        }

        if (name_location !== undefined)
          campaignLocation.name_location = name_location;
        if (id_country !== undefined) campaignLocation.id_country = id_country;
        await campaignLocation.save();
      } else {
        // Cas pour la création d'une nouvelle localisation

        // Si `id_country` n'est pas directement fourni, essayez de le trouver ou de le créer à partir de `country`
        let countryId = id_country;
        if (!countryId && country) {
          // Normaliser le nom du pays en minuscule pour éviter les doublons dus à la casse
          const countryNameLower = country.name.toLowerCase();
          console.log('countryNameLower:', countryNameLower);

          const [countryRecord] = await Country.findOrCreate({
            where: sequelize.where(
              sequelize.fn('LOWER', sequelize.col('name')),
              countryNameLower,
            ),
            defaults: { name: countryNameLower }, // Utiliser la même casse pour l'insertion
          });

          countryId = countryRecord.id;
        }

        if (!countryId) {
          return res.status(400).json({
            message:
              'Impossible de créer la localisation sans un id_country valide.',
          });
        }

        // Créer la nouvelle localisation avec l'`id_country` résolu
        campaignLocation = await CampaignLocation.create({
          name_location,
          id_country: countryId,
        });
      }

      // Associer le pays à la localisation si des détails `country` sont fournis
      if (country) {
        let countryRecord;
        if (country.id) {
          countryRecord = await Country.findByPk(country.id);
          if (!countryRecord) {
            return res.status(404).json({
              message: `Le pays avec l'id ${country.id} n'a pas été trouvé`,
            });
          }
        } else {
          // find ou create pour éviter les doublons porte bien son nom
          [countryRecord] = await Country.findOrCreate({
            where: sequelize.where(
              sequelize.fn('LOWER', sequelize.col('name')),
              country.name.toLowerCase(),
            ),
            defaults: { name: country.name.toLowerCase() }, // Utiliser la même casse pour l'insertion
          });
        }

        // Mettre à jour le nom du pays si nécessaire
        if (country.name !== undefined) countryRecord.name = country.name;
        await countryRecord.save();

        // Associer le pays à la localisation de la campagne
        await campaignLocation.setCountry(countryRecord);
      }

      // Associer la localisation à la campagne
      await campaign.setLocation(campaignLocation);
    }

    console.log('mise à jour effectué pour la campagne ID:', campaignId);

    res.status(200).redirect('/admin/campaigns');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la campagne:', error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de la campagne',
      error: error.message,
    });
  }
}

export async function deleteCampaignBackOffice(req, res) {
  const transaction = await sequelize.transaction(); // Démarrer une transaction
  try {
    // Vérification de l'ID
    const campaignId = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(campaignId)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'ID de campagne invalide' });
    }

    const campaign = await Campaign.findByPk(campaignId, {
      include: [
        { model: Tree, as: 'treesCampaign' },
        { model: CampaignLocation, as: 'location' },
      ],
      transaction,
    });

    if (!campaign) {
      await transaction.rollback();
      return res.status(404).json({
        message: `La campagne avec l'id ${req.params.id} n'a pas été trouvée`,
      });
    }

    // Supprimer la campagne avec toutes les associations grâce à `CASCADE`
    await campaign.destroy({ transaction });

    await transaction.commit(); // Valider la transaction
    res.status(200).redirect('/admin/campaigns');
  } catch (error) {
    await transaction.rollback(); // Annuler la transaction en cas d'erreur
    console.error('Erreur lors de la suppression de la campagne :', error);
    res.status(500).json({
      message: 'Erreur lors de la suppression de la campagne',
      error: error.message,
    });
  }
}
