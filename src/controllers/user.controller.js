import { User, Review } from '../models/index.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';

export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Review,
          as: 'reviews',
        },
      ],
      order: [['id', 'ASC']],
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function getOneUser(req, res) {
  try {
    const userId = Number.parseInt(req.params.id);

    // Comparer l'id de user et req.userId du token
    if (userId !== req.userId) {
      console.log('dégage');
      res.status(403).send('Accès refusé');
      return;
    }

    if (Number.isNaN(userId)) {
      res.status(400).send("L'id doit être un nombre");
      return;
    }
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password', 'is_admin'],
      },
      include: [
        {
          model: Review,
          as: 'reviews',
        },
      ],
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

//todo sécuriser le password
export async function createUser(req, res) {
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

    //todo  ajouter un minimum de caractère ou de chiffre pour le password ??

    //todo limiter le nombre de caracaères pour les champs (ex siret)
    //todo vérifier que l'email n'existe pas déjà => find by email ?
    //todo vérifier que le role existe
    //todo vérifier que le siret est unique ?
    //todo vérifier que le siret est valide
    //todo vérifier que le téléphone est valide (nb de chiffres ?)
    //todo vérifier que le code postal est valide ?

    const createUserSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
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

//todo vérifier que l'email n'existe pas déjà => find by email ?

export async function updateUser(req, res) {
  try {
    //récupérer l'id de l'utilisateur à modifier
    const userId = Number.parseInt(req.params.id);
    console.log(userId);

    if (Number.isNaN(userId)) {
      res.status(400).send("L'id doit être un nombre");
      return;
    }

    const createUserSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
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
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      message: 'Utilisateur modifié',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = Number.parseInt(req.params.id);

    if (Number.isNaN(userId)) {
      res.status(400).send("L'id doit être un nombre");
      return;
    }

    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).send('Utilisateur non trouvé');
      return;
    }

    await user.destroy();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
