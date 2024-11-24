import { User } from '../../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function loginVerify(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).json('Email et mot de passe requis');
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

    // Si l'utilisateur n'existe pas
    if (!user) {
      res.status(401).send('Email ou mot de passe incorrect');
      return;
    }

    // Comparaison du mot de passe entre saisie et bdd
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).send('Email ou mot de passe incorrect');
      return;
    }

    if (user.is_admin === false) {
      res.status(401).send('Accès refusé');
      return;
    }

    if (user.is_admin) {
      const accesstoken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        },
      );

      res.cookie('token', accesstoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000, // 1 heure
      });

      return res.status(200).json({
        message: 'Connexion réussie',
        redirect: `${req.app.locals.baseUrl}/admin/home`,
      });
    }
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

export function logout(req, res) {
  // Suppression du cookie 'jwt'
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/',
  });

  res.status(200).json({
    message: 'Déconnexion réussie',
    redirect: `${req.app.locals.baseUrl}/admin/login`,
  });
}
