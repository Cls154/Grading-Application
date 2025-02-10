// /api/modules GET

import jwt from 'jsonwebtoken';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  try {
    // Get user JWT and verify it
    const cookie = parseCookies(event);
    const token = cookie.userJWT;

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not Authorised to access modules'
      })
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Find all the modules associated with that user
    const userModules = await prisma.user_Module.findMany({
      where: {
        userId: decoded.id
      },
      include: {
        module: true,
      }
    })
    
    const modules = userModules.map(userModule => userModule.module);

    // Send user modules to frontend
    return { status: 'Success', data: modules };

  } catch (e) {
    // Log the error for debugging
    console.error('Error fetching user modules:', e);

    // jwt error
    if (e instanceof jwt.JsonWebTokenError) {
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      });
    }

    // generic server error
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    });
  }
})