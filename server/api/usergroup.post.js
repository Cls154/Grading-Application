// /api/userGroup POST

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
    
    const userGroup = await prisma.user_Group.create({
      data: {
        userId: decoded.id,
        groupId: body.groupId
      }
    })

    return { status: 'Success', message: `Successfully added user ${userGroup.userId} to group ${userGroup.groupId}` };

  } catch (e) {
    throw e;
  }
})