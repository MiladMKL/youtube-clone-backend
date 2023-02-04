import jwt from 'jsonwebtoken';
import { createError } from './error.js';

// req bzw. Request is das was ich vom Browser kriege!
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, 'You are not authenticated!'));
  }

  // verify return either err or our information
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return next(createError(403, 'Token is not valid!'));
    }
    // Füge einen weiteren key zu dem Javascript Object und setze aus user!
    req.user = user;
    console.log('req: ', req);
    next();
  });
};
