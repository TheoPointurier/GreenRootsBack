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
