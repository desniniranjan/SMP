import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'mern_student_portal_jwt_secret_key_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};
