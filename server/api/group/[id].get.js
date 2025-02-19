// /api/group/:id GET

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

    const group = await prisma.groups.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        userGroup: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    if (!group) {
      throw createError({
        statusCode: 404,
        message: 'Could not find group'
      })
    }

    const myGroup = {
      ...group,
      userGroup: group.userGroup.map(ug => ({
        ...ug,
        isMe: ug.userId === decoded.id,
      }))
    }

    const myUserGroupId = myGroup.userGroup.find(ug => ug.isMe).id;

    const contributionForms = await prisma.my_Contribution.findUnique({
      where: {
        id: myUserGroupId
      },
      select: {
        myUserReflection: true,
        contributionForms: {
          select: {
            targetUserId: true,
            targetUserContribution: true,
          }
        }
      }
    })

    console.log(contributionForms);

    return { status: 'Success', group: myGroup, contributionForm: contributionForms }

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