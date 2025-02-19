// /api/usergroup/:id PATCH

import jwt from 'jsonwebtoken';
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    const cookie = parseCookies(event);
    const token = cookie.userJWT;

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not Authorised'
      })
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const userGroupTryingToSubmit = await prisma.user_Group.findUnique({
      where: {
        id: Number(id),
      }
    })

    if (!userGroupTryingToSubmit) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User group does not exist'
      })
    }

    if (userGroupTryingToSubmit.userId !== decoded.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Does not have permission to submit this'
      })
    }

    if (userGroupTryingToSubmit.hasSubmitted) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You have already submitted'
      })
    }

    await prisma.user_Group.update({
      where: {
        id: Number(id),
      },
      data: {
        hasSubmitted: true
      }
    })

    return { status: 'Success', message: 'Successfully submitted'}
  } catch (e) {
    console.error(e);
    throw createError({ statusCode: 500, statusMessage: 'Failed to Submit' })
  }
})