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
    
    const userGroup = await prisma.user_Group.findFirst({
      where: {
        userId: decoded.id,
        groupId: body.groupId
      }
    })

    if (!userGroup) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User is not in this group'
      })
    }

    // in database jsut need to put oncascade delete
    const deletedUserGroup = await prisma.user_Group.delete({
      where: {
        id: userGroup.id
      }
    })

    const removeFromOthersContributionForm = await prisma.contribution_Forms.deleteMany({
      where: {
        targetUserId: decoded.id,
        groupId: body.groupId,
      }
    })

    return { status: 'Success', message: `Successfully removed from group ${body.groupId}` };

  } catch (e) {
    throw e;
  }
})