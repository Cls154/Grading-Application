// /api/login POST

import jwt from 'jsonwebtoken';
import bcyrpt from 'bcryptjs';
import validator from 'validator';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    if (!validator.isEmail(body.email)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid email, try again.',
      })
    }

    if (!validator.isStrongPassword(body.password, {
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    }))
    {
      throw createError({
        statusCode: 400,
        message: 'Password must be 8 characters'
      })
    }
    

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      }
    });

    const isValid = await bcyrpt.compare(body.password, user.password);

    if (!isValid) {
      throw createError({
        statusCode: 400,
        message: 'Username or password is invalid',
      })
    }

    const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET);
    setCookie(event, 'userJWT', token);

    return { data: 'success', role: user.role };

  } catch (e) {
    console.log(e);
    throw e;
  }
})