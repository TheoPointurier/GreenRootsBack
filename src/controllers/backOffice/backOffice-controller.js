import { User } from '../../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function loginVerify(req, res) {
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

    // Comparaison du mot de passe entre saisie et bdd
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).send('Email ou mot de passe incorrect');
      return;
    }

    if (user.is_admin === false) {
      res.status(401).send('dégage');
      return;
    }

    // Création du token d'authentification qui expire au bout d'une heure
    const accesstoken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // // Stocker le token dans un cookie sécurisé
    // res.cookie('token', accesstoken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production', // true en production, false en développement
    //   maxAge: 60 * 60 * 1000, // 1 heure
    // });

    // Envoi du token
    // return res.json({ accesstoken });
    console.log('coucou');
    res.redirect('/admin/home');
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export function loginPage(req, res) {
  res.render('login');
}

export function adminPage(req, res) {
  res.render('home');
}
