import { User } from '../models/index.js';

export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    console.log(users);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function getOneUser(req, res) {
  try {
    const userId = Number.parseInt(req.params.id);
    console.log(userId);

    if (Number.isNaN(userId)) {
      res.status(400).send("L'id doit être un nombre");
      return;
    }
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).send('Utilisateur non trouvé');
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
