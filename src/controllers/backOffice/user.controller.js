import { User, Review } from '../../models/index.js';
import bcrypt from 'bcrypt';
import Joi from 'joi';

export async function getAllUsersBackOffice(req, res) {
  try {
    const users = await User.findAll({
      attributes: { 
        exclude: ['password'] 
      },
      include: [
        {
          model: Review,
          as: 'reviews',
        },
      ],
      order: [['id', 'ASC']],
    });
    console.log(users);
    res.render('users', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

//todo sécuriser le password
export async function createUserBackOffice(req, res) {
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
      is_admin,

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
      is_admin: Joi.boolean().required(),
    });

    const { error } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // on hash le password
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
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
      is_admin,
    });

    res.status(201).redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}