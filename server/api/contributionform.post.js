// /api/contributionform POST

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

    const { myUserGroup, personalReflection, contributions } = body;
    
    const myContribution = await prisma.my_Contribution.create({
      data: {
        userGroupId: myUserGroup,
        myUserReflection: personalReflection,
      }
    })

    for (const userId in contributions) {
      await prisma.contribution_Forms.create({
        data: {
          contributionsId: myContribution.id,
          targetUserId: Number(userId),
          targetUserContribution: contributions[userId],
        }
      })
    }


    return { status: 'Success', message: `` };

  } catch (e) {
    // Log the error for debugging
    console.error('Error posting contribution form:', e);

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