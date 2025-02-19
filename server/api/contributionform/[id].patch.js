// /api/contributionform/:id PATCH

import jwt from 'jsonwebtoken';
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);

    const cookie = parseCookies(event);
    const token = cookie.userJWT;

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not Authorised'
      })
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    await prisma.$transaction([
      prisma.my_Contribution.update({
        where: { id: Number(id) },
        data: { 
          myUserReflection: body.personalReflection
        }
      }),

      ...Object.entries(body.contributions).map(([targetUserId, targetUserContribution]) =>
        prisma.contribution_Forms.updateMany({
          where: {
            contributionsId: Number(id),
            targetUserId: Number(targetUserId),
          },
          data: { 
            targetUserContribution
          },
        })
      )
    ]);

    return { status: 'Success', message: 'Contributions updated successfully'}
  } catch (e) {
    console.error(e);
    throw createError({ statusCode: 500, statusMessage: 'Failed to update contributions' })
  }
})