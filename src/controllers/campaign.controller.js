import { Campaign, CampaignLocation, Country, Tree } from '../models/index.js';
import Joi from 'joi';

export async function getAllCampaign(req, res) {
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
        },
      ],
    });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getCampaign(req, res) {
  try {
    // Schéma de validation pour l'ID de la campagne
    const schema = Joi.object({
      id: Joi.number().integer().required(),
    });

    // Validation de l'ID avec Joi
    const { error } = schema.validate({ id: req.params.id });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const campaignID = Number.parseInt(req.params.id);

    const campaign = await Campaign.findByPk(campaignID, {
      // inclure l'assocition avec la table CampaignLocation
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
        // inclure l'assocition avec la table Tree
        {
          model: Tree,
          as: 'treesCampaign',
        },
      ],
    });

    if (campaign === null) {
      res.status(404).json({
        message: `La Campagne avec l'id ${req.params.id} n'a pas été trouvé`,
      });
    } else {
      res.json(campaign);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createCampaign(req, res) {
  try {
    // Schéma de validation pour la création de la campagne
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      start_campaign: Joi.date().iso(),
      end_campaign: Joi.date().iso(),
      treesCampaign: Joi.array().items(
        Joi.object({
          id: Joi.number().integer().required(),
          name: Joi.string().required(),
          price_ht: Joi.number().precision(2),
          quantity: Joi.number().integer(),
          age: Joi.number().integer().required(),
        }),
      ),
      location: Joi.object({
        name_location: Joi.string().required(),
        id_country: Joi.number().integer().required(),
        country: Joi.object({
          id: Joi.number().integer().required(),
          name: Joi.string().required(),
        }),
      }),
    });

    // Validation de la requête avec Joi
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Extraire les données de la requête
    const { name, description, start_campaign, end_campaign, treesCampaign } =
      req.body;

    // Création de la campagne
    const campaign = await Campaign.create({
      name,
      description,
      start_campaign,
      end_campaign,
    });

    // Si des IDs d'arbres sont fournis, les associer à la campagne
    if (treesCampaign && treesCampaign.length > 0) {
      await campaign.addTreesCampaign(treesCampaign); // Associer les arbres avec la campagne
    }

    res.status(201).json({
      message: 'Campagne créée avec succès et arbres associés',
      campaign,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de la campagne',
      error: error.message,
    });
  }
}

export async function updateCampaign(req, res) {
  try {
    // Schéma de validation pour la création de la campagne
    const schema = Joi.object({
      id: Joi.number().integer().required(),
      name: Joi.string().required(),
      description: Joi.string(),
      start_campaign: Joi.date().iso(),
      end_campaign: Joi.date().iso(),
      treesCampaign: Joi.array().items(
        Joi.object({
          id: Joi.number().integer().required(),
          name: Joi.string().required(),
          price_ht: Joi.number().precision(2),
          quantity: Joi.number().integer(),
          age: Joi.number().integer().required(),
        }),
      ),
      location: Joi.object({
        name_location: Joi.string().required(),
        id_country: Joi.number().integer().required(),
        country: Joi.object({
          id: Joi.number().integer().required(),
          name: Joi.string().required(),
        }),
      }),
    });

    // Validation de la requête avec Joi
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const campaign = await Campaign.findByPk(req.params.id);

    if (campaign === null) {
      res.status(404).json({
        message: `La Campagne avec l'id ${req.params.id} n'a pas été trouvé`,
      });
    } else {
      // Extraire les données de la requête
      const { name, description, start_campaign, end_campaign, treesCampaign } =
        req.body;

      // Mettre à jour la campagne
      await campaign.save({
        name,
        description,
        start_campaign,
        end_campaign,
      });

      // Gérer les associations d'arbres
      if (treesCampaign && treesCampaign.length > 0) {
        // `setTreesCampaign` va remplacer les associations existantes par celles spécifiées dans `treesCampaign`
        await campaign.setTreesCampaign(treesCampaign);
      } else {
        // Si `treesCampaign` est vide ou non défini, on supprime toutes les associations d'arbres de cette campagne
        await campaign.setTreesCampaign([]);
      }

      res.json({
        message: 'Campagne mise à jour avec succès et arbres associés',
        campaign,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de la campagne',
      error: error.message,
    });
  }
}

export async function deleteCampaign(req, res) {
  try {
    // Rechercher la campagne par son ID
    const campaign = await Campaign.findByPk(req.params.id);

    if (campaign === null) {
      res.status(404).json({
        // si id non trouvé informer l'utilisateur
        message: `La Campagne avec l'id ${req.params.id} n'a pas été trouvé`,
      });
    } else {
      await campaign.destroy();
      res.json({ message: 'Campagne supprimée avec succès' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de la campagne',
      error: error.message,
    });
  }
}
