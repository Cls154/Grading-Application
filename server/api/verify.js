// /api/verify GET

import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'userJWT');

  if (!token) {
    return { valid: false };
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, user: decoded }
  } catch (e) {
    console.log(e);
    return { valid: false }
  }
})