import { Campaign, CampaignLocation, Tree } from "../models/index.js";

export async function getAllCampaign(req, res) {
  try {
    const campaigns = await Campaign.findAll({
      include: [
        {
          model: CampaignLocation,
          as: "location",
        },
        {
          model: Tree,
          as: "treesCampaign",
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
    const campaign = await Campaign.findByPk(req.params.id, {
      // inclure l'assocition avec la table CampaignLocation
      include: [
        {
          model: CampaignLocation,
          as: "location",
        },
        // inclure l'assocition avec la table Tree
        {
          model: Tree,
          as: "treesCampaign",
        },
      ],
    });

    if (campaign === null) {
      res
        .status(404)
        .json({
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
      message: "Campagne créée avec succès et arbres associés",
      campaign,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de la campagne",
      error: error.message,
    });
  }
}

export async function updateCampaign(req, res) {
  try {
    const campaign = await Campaign.findByPk(req.params.id);

    if (campaign === null) {
      res
        .status(404)
        .json({
          message: `La Campagne avec l'id ${req.params.id} n'a pas été trouvé`,
        });
    } else {
      // Extraire les données de la requête
      const { name, description, start_campaign, end_campaign, treesCampaign } =
        req.body;

      // Mettre à jour la campagne
      await campaign.update({
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
        message: "Campagne mise à jour avec succès et arbres associés",
        campaign,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la campagne",
      error: error.message,
    });
  }
}
