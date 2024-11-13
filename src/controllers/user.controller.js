import { User, Review } from '../models/index.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const userSchema = Joi.object({
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

export async function getOneUser(req, res) {
  try {
    // Validation de l'ID avec Joi
    const { error } = idSchema.validate({ id: req.params.id });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const userId = Number.parseInt(req.params.id);

    // Comparer l'id de user et req.userId du token
    if (userId !== req.userId) {
      res.status(403).send('Accès refusé');
      return;
    }

    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password', 'is_admin'],
      },
    });

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
export async function updateUser(req, res) {
  try {
    // Schéma de validation de l'ID
    const { errorId } = idSchema.validate({ id: req.params.id });
    if (errorId) {
      return res.status(400).json({ message: errorId.message });
    }
    //récupérer l'id de l'utilisateur à modifier
    const userId = Number.parseInt(req.params.id);

    // On valide les infos reçues avant la requête
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).send('Utilisateur non trouvé');
      return;
    }

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

    // Vérifier si l'email existe déjà dans la base de données pour un autre utilisateur (et si pas modifié)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          error: 'Cet email est déjà utilisé par un autre utilisateur',
        });
      }
    }

    user.email = email || user.email;
    user.password = password || user.password;
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.city = city || user.city;
    user.postal_code = postal_code || user.postal_code;
    user.street = street || user.street;
    user.street_number = street_number || user.street_number;
    user.country = country || user.country;
    user.id_role = id_role || user.id_role;
    user.phone_number = phone_number || user.phone_number;
    user.entity_name = entity_name || user.entity_name;
    user.entity_type = entity_type || user.entity_type;
    user.entity_siret = entity_siret || user.entity_siret;

    // on hash le password
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: 'Utilisateur modifié',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Une erreur s'est produite");
  }
}
export async function deleteUser(req, res) {
  try {
    // Schéma de validation de l'ID
    const { errorId } = idSchema.validate({ id: req.params.id });
    if (errorId) {
      return res.status(400).json({ message: errorId.message });
    }
    const userId = Number.parseInt(req.params.id);

    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).send('Utilisateur non trouvé');
      return;
    }

    await user.destroy();

    res.status(204);
  } catch (error) {
    console.error(error);
    res.status(500).json("Une erreur s'est produite");
  }
}
export async function getAllReviews(req, res) {
  try {
    const reviews = await Review.findAll({
      order: [['id', 'ASC']],
    });

    if (!reviews || reviews.length === 0) {
      res.status(404).send('Aucun avis trouvé');
      return;
    }

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json("Une erreur s'est produite");
  }
}
