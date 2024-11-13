import { Tree, TreeSpecies } from '../models/index.js';

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

    if (Number.isNaN(treeId) || treeId <= 0) {
      res.status(400).send("L'id doit être un nombre entier positif");
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
