import { User } from '../models/index.js';
import Joi from 'joi';

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

    //todo limiter le nombre de caracaères pour les champs (ex siret)
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

    const user = await User.create({
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
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

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

    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
