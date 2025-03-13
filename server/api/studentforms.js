// /api/studentforms GET

import jwt from 'jsonwebtoken';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  try {
    const cookie = parseCookies(event);
    const token = cookie.userJWT;

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not Authorised',
      })
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'educator') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not Authorised',
      })
    }

    const studentForms = await prisma.user_Module.findMany({
      where: {
        userId: decoded.id
      },
      include: {
        module: {
          include: {
            groups: {
              include: {
                userGroup: {
                  include: {
                    myContribution: {
                      include: {
                        contributionForms: {
                          include: {
                            targetUser: {
                              select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                              }
                            }
                          }
                        }
                      }
                    },
                    user: {
                      select: {
                        firstName: true,
                        lastName: true,
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })


    // Send user modules to frontend
    return { status: 'Success', data: studentForms };

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