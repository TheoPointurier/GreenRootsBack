import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

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

    // permet de renvoyer les données pour le front
    const userSafe = {
      ...user.dataValues,
    };

    // biome-ignore lint/performance/noDelete: <explanation>
    delete userSafe.password;
    // biome-ignore lint/performance/noDelete: <explanation>
    delete userSafe.is_admin;

    // Création du token d'authentification qui expire au bout d'une heure
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Envoi du token
    return res.json({ accessToken, user: userSafe });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function register(req, res) {
  try {
    const {
      email,
      password,
      firstname,
      lastname,
      city,
      postal_code,
      street,
      street_number,
      country,
      id_role,
      phone_number,
      entity_name,
      entity_type,
      entity_siret,
    } = req.body;

    const createUserSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(12)
        .pattern(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}/,
        )
        .required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      city: Joi.string().required(),
      postal_code: Joi.string().required(),
      street: Joi.string().required(),
      street_number: Joi.number().required(),
      country: Joi.string().required(),
      phone_number: Joi.number(),
      entity_name: Joi.string(),
      entity_type: Joi.string(),
      entity_siret: Joi.string(),
      id_role: Joi.number().required(),
    });

    const { error } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'Cet email est déjà utilisé par un autre utilisateur' });
    }

    // on hash le password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      city,
      postal_code,
      street,
      street_number,
      country,
      id_role,
      phone_number,
      entity_name,
      entity_type,
      entity_siret,
    });

    res.status(201).json({
      message: 'Utilisateur créé',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
