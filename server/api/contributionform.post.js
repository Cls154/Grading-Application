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
    
    await prisma.$transaction(async (prisma) => {
      const myContribution = await prisma.my_Contribution.create({
        data: {
          userGroupId: myUserGroup,
          myUserReflection: personalReflection,
        }
      })

      const contributionEntries = Object.entries(contributions).map(([userId, value]) => ({
        contributionsId: myContribution.id,
        targetUserId: Number(userId),
        targetUserContribution: value,
      }))

      await prisma.contribution_Forms.createMany({
        data: contributionEntries,
      })

      await prisma.user_Group.update({
        where: {
          id: myUserGroup
        },
        data: {
          hasSubmitted: true, // throw error is already true
        }
      })
    })

    
    return { status: 'Success', message: `successfully submitted contributions` };

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