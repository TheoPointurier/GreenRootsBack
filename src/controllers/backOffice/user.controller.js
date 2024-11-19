import { User, Review, Role } from '../../models/index.js';
import bcrypt from 'bcrypt';
import Joi from 'joi';

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(12)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\p{L}\p{N}\p{P}\p{S}])[\p{L}\p{N}\p{P}\p{S}]{12,}$/u,
    )
    .required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  city: Joi.string().required(),
  postal_code: Joi.string().required(),
  street: Joi.string().required(),
  street_number: Joi.number().required(),
  country: Joi.string().required(),
  phone_number: Joi.number().allow(null),
  entity_name: Joi.string().allow(''),
  entity_siret: Joi.string().allow(''),
  id_role: Joi.number().required(),
  is_admin: Joi.boolean().required(),
});

const updateUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(12)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\p{L}\p{N}\p{P}\p{S}])[\p{L}\p{N}\p{P}\p{S}]{12,}$/u,
    )
    .optional(),
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
  city: Joi.string().optional(),
  postal_code: Joi.string().optional(),
  street: Joi.string().optional(),
  street_number: Joi.number().optional(),
  country: Joi.string().optional(),
  phone_number: Joi.number().allow(null),
  entity_name: Joi.string().allow('').optional(),
  entity_siret: Joi.string().allow('').optional(),
  id_role: Joi.number().optional(),
  is_admin: Joi.boolean().optional(),
});

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

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
    // Schéma de validation de l'ID
    const { error: idError } = idSchema.validate({ id: req.params.id });
    if (idError) {
      return res.status(400).json({ message: idError.message });
    }
    //récupérer l'id de l'utilisateur à modifier
    const userId = Number.parseInt(req.params.id);

    const { error: userError } = updateUserSchema.validate(req.body);
    if (userError) {
      return res.status(400).json({ error: userError.message });
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
      user.password = await bcrypt.hash(password, 10);
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

    res.status(204).redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite");
  }
}
