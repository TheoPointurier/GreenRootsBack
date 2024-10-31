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

    // Gérer les associations de localisation
    let campaignLocation;
    if (location) {
      const { id: locationId, name_location, id_country, country } = location;

      if (locationId) {
        // Trouver la localisation par ID
        campaignLocation = await CampaignLocation.findByPk(locationId);
        if (!campaignLocation) {
          return res.status(404).json({
            message: `La localisation avec l'id ${locationId} n'a pas été trouvée`,
          });
        }
        // Mettre à jour la localisation
        if (name_location !== undefined)
          campaignLocation.name_location = name_location;
        if (id_country !== undefined) campaignLocation.id_country = id_country;
        await campaignLocation.save();
      } else {
        // Créer une nouvelle localisation
        campaignLocation = await CampaignLocation.create({
          name_location,
          id_country,
        });
      }

      // Gérer le pays associé à la localisation
      if (country) {
        const { id: countryId, name: countryName } = country;
        let countryRecord;

        if (countryId) {
          countryRecord = await Country.findByPk(countryId);
          if (!countryRecord) {
            return res.status(404).json({
              message: `Le pays avec l'id ${countryId} n'a pas été trouvé`,
            });
          }
          if (countryName !== undefined) countryRecord.name = countryName;
          await countryRecord.save();
        } else {
          countryRecord = await Country.create({ name: countryName });
        }

        // Associer le pays à la localisation
        await campaignLocation.setCountry(countryRecord);
      }

      // Associer la localisation à la campagne
      await campaign.setLocation(campaignLocation);
    }

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
          .json({ message: 'Certains arbres fournis n’existent pas' });
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

    res.status(201).json({
      message: 'Campagne créée avec succès',
      campaign: newCampaign,
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
    // Schéma de validation pour la mise à jour de la campagne
    const schema = Joi.object({
      id: Joi.number().integer().required(),
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

    const campaign = await Campaign.findByPk(req.params.id);

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

      if (locationId) {
        // Trouver la localisation par ID
        campaignLocation = await CampaignLocation.findByPk(locationId);
        if (!campaignLocation) {
          return res.status(404).json({
            message: `La localisation avec l'id ${locationId} n'a pas été trouvée`,
          });
        }
        // Mettre à jour la localisation
        if (name_location !== undefined)
          campaignLocation.name_location = name_location;
        if (id_country !== undefined) campaignLocation.id_country = id_country;
        await campaignLocation.save();
      } else {
        // Créer une nouvelle localisation
        campaignLocation = await CampaignLocation.create({
          name_location,
          id_country,
        });
      }

      // Gérer le pays associé à la localisation
      if (country) {
        const { id: countryId, name: countryName } = country;
        let countryRecord;

        if (countryId) {
          countryRecord = await Country.findByPk(countryId);
          if (!countryRecord) {
            return res.status(404).json({
              message: `Le pays avec l'id ${countryId} n'a pas été trouvé`,
            });
          }
          if (countryName !== undefined) countryRecord.name = countryName;
          await countryRecord.save();
        } else {
          countryRecord = await Country.create({ name: countryName });
        }

        // Associer le pays à la localisation
        await campaignLocation.setCountry(countryRecord);
      }

      // Associer la localisation à la campagne
      await campaign.setLocation(campaignLocation);
    }

    // Récupérer la campagne mise à jour avec ses associations
    const updatedCampaign = await Campaign.findByPk(req.params.id, {
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

    res.json({
      message: 'Campagne mise à jour avec succès',
      campaign: updatedCampaign,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de la campagne',
      error: error.message,
    });
  }
}

export async function deleteCampaign(req, res) {
  try {
    // Rechercher la campagne par son ID avec ses associations
    const campaign = await Campaign.findByPk(req.params.id, {
      include: [
        {
          model: Tree,
          as: 'treesCampaign',
        },
        {
          model: CampaignLocation,
          as: 'location',
        },
      ],
    });

    if (!campaign) {
      return res.status(404).json({
        message: `La campagne avec l'id ${req.params.id} n'a pas été trouvée`,
      });
    }

    // Supprimer les associations avec les arbres
    await campaign.setTreesCampaign([]);
    // Supprimer l'association avec la localisation
    await campaign.setLocation(null);
    // Supprimer la campagne
    await campaign.destroy();

    res.json({ message: 'Campagne supprimée avec succès' });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de la campagne',
      error: error.message,
    });
  }
}
