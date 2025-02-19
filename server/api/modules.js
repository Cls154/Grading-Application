// /api/modules GET

import jwt from 'jsonwebtoken';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  try {
    const cookie = parseCookies(event);
    const token = cookie.userJWT;

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not Authorised'
      })
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Find all the modules associated with that user
    const userModules = await prisma.user_Module.findMany({
      where: {
        userId: decoded.id
      },
      include: {
        module: {
          include: {
            groups: {
              include: {
                userGroup: true,
              }
            },
          }
        },
      }
    })

    if (!userModules) {
      throw createError({
        statusCode: 404,
        message: 'Could not find user modules'
      })
    }
    
    const modules = userModules.map(userModule => {
      return {
        ...userModule.module,
        groups: userModule.module.groups.map(group => ({
          ...group,
          isPartOf: group.userGroup.some(userGroup => userGroup.userId === decoded.id)
        }))
      }
    });

    // Send user modules to frontend
    return { status: 'Success', user: decoded.id, data: modules };

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