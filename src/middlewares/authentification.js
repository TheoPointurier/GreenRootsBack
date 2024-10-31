import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next) {
  // On sépare le token du mot Bearer (car le token est de la forme "Bearer token)
  const token = req.header('Authorization').split(' ');

  // On vérifie que le token est bien de la forme "Bearer token
  if (!token[1] || token[0] !== 'Bearer') {
    return res.status(401).send('Accès refusé');
  }

  try {
    // On vérifie que le token est valide
    const decoded = jwt.verify(token[1], process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).send('Token invalide');
  }
}
