// /api/userGroup DELETE

// Error handling needed in here

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
    const body = await readBody(event);
    
    const userGroupTryingToDelete = await prisma.user_Group.findFirst({
      where: {
        userId: decoded.id,
        groupId: body.groupId
      }
    })

    if (!userGroupTryingToDelete) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User Group does not exist',
      })
    }

    if (userGroupTryingToDelete.hasSubmitted) {
      console.log('hi')
      throw createError({
        statusCode: 400,
        message: 'Cannot leave group, you have already submitted peer evaluation'
      })
    }

    await prisma.$transaction([
      prisma.user_Group.delete({
        where: {
          id: userGroupTryingToDelete.id
        }
      }),

      prisma.contribution_Forms.deleteMany({
        where: {
          targetUserId: decoded.id,
          groupId: body.groupId,
        }
      }),
    ]);

    return { status: 'Success', message: `Successfully removed from group ${body.groupId}` };

  } catch (e) {
    throw e;
  }
})