import { User, Review, Role } from '../../models/index.js';
import bcrypt from 'bcrypt';
import Joi from 'joi';

export async function getAllUsersBackOffice(req, res) {
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
        {
          model: Role,
          as: 'role',
        },
      ],
      order: [['id', 'ASC']],
    });
    const roles = await Role.findAll();
    res.render('users', { users, roles });
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
      entity_siret,
      is_admin,
    } = req.body;

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
      entity_name: Joi.string().allow(''),
      entity_siret: Joi.string().allow(''),
      id_role: Joi.number().required(),
      is_admin: Joi.boolean().required(),
    });

    const { error } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'Cet email est déjà utilisé par un autre utilisateur' });
    }

    const role = await Role.findByPk(id_role);
    if (!role) {
      return res.status(400).json({ error: "Le rôle spécifié n'existe pas" });
    }
    const entity_type = role.name;

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
    res.status(500).json({ error: "Une erreur s'est produite" });
  }
}

export async function updateUserBackOffice(req, res) {
  try {
    //récupérer l'id de l'utilisateur à modifier
    const userId = Number.parseInt(req.params.id);

    if (Number.isNaN(userId)) {
      res.status(400).send("L'id doit être un nombre");
      return;
    }

    const createUserSchema = Joi.object({
      email: Joi.string().email().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      city: Joi.string().required(),
      postal_code: Joi.string().required(),
      street: Joi.string().required(),
      street_number: Joi.number().required(),
      country: Joi.string().required(),
      phone_number: Joi.number(),
      entity_name: Joi.string().allow(''),
      entity_type: Joi.string(),
      entity_siret: Joi.string().allow(''),
      id_role: Joi.number().required(),
      is_admin: Joi.boolean(), // Ajout de is_admin
    });

    const { error } = createUserSchema.validate(req.body);
    console.log(req.body); // Debug
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
      is_admin,
    } = req.body;

    // Vérifier si l'email existe déjà dans la base de données pour un autre utilisateur
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser && existingUser.id !== userId) {
      console.log('Email déjà utilisé par un autre utilisateur'); // Debug
      return res
        .status(400)
        .send('Cet email est déjà utilisé par un autre utilisateur');
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
    user.phone_number = phone_number || user.phone_number;
    user.entity_name = entity_name || user.entity_name;
    user.entity_type = entity_type || user.entity_type;
    user.entity_siret = entity_siret || user.entity_siret;
    // passage en undefined car avec l'opérateur ||, si is_admin est false, il ne sera pas mis à jour car considéré comme falsy
    user.is_admin = is_admin !== undefined ? is_admin : user.is_admin;
    if (id_role !== user.id_role) {
      user.id_role = id_role;

      // Récupérer le rôle correspondant pour définir l'entity_type avec le name du rôle
      const role = await Role.findByPk(id_role);
      if (role) {
        user.entity_type = role.name; // Assigner le `name` du rôle comme `entity_type`
      }
    }

    // on hash le password
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    console.log('User mis à jour avec succès :', user);

    res.status(200).redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}

export async function deleteUserBackOffice(req, res) {
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

    res.status(204).redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
