import Joi from 'joi';
import { Tree, TreeSpecies } from '../models/index.js';

//todo limiter le nombre d'arbres envoyé ?
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
    const treeId = Number.parseInt(req.params.id);
    console.log(treeId);

    if (Number.isNaN(treeId)) {
      res.status(400).send("L'id doit être un nombre");
      return;
    }
    const tree = await Tree.findByPk(treeId, {
      include: [
        {
          model: TreeSpecies,
          as: 'species',
        },
      ],
    });
    if (!tree) {
      res.status(404).send('Arbre non trouvé');
      return;
    }
    res.json(tree);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
