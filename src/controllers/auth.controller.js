import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).send('Email et mot de passe requis');
    return;
  }

  try {
    // Recherche de l'utilisateur dans la bdd via l'email en récupérant uniquement le mot de passe
    const user = await User.findOne({
      where: { email },
      attributes: {
        include: ['password'],
      },
    });
    console.log(user);

    // Comparaison du mot de passe entre saisie et bdd
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).send('Email ou mot de passe incorrect');
      return;
    }
    // Création du token d'authentification qui expire au bout d'une heure
    const accesstoken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log(accesstoken);
    // Envoi du token
    return res.json({ accesstoken });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
