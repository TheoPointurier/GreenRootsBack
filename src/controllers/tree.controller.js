import { Tree, TreeSpecies } from '../models/index.js';
import Joi from 'joi';

export async function getAllTrees(req, res) {
  try {
    const trees = await Tree.findAll({
      include: [
        {
          model: TreeSpecies,
          as: 'species',
        },
      ],
    });
    res.json(trees);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function getOneTree(req, res) {
  try {
    const schema = Joi.object({
      id: Joi.number().integer().positive().required(),
    });

    // Validation de l'ID avec Joi
    const { error } = schema.validate({ id: req.params.id });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const treeId = Number.parseInt(req.params.id);

    const tree = await Tree.findByPk(treeId, {
      include: [
        {
          model: TreeSpecies,
          as: 'species',
        },
      ],
    });
    if (tree === null) {
      res.status(404).json({
        message: `L'arbre avec l'id ${req.params.id} n'a pas été trouvé`,
      });
    } else {
      res.json(tree);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
