// /api/userGroup POST

// Error Handling in here needed

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

    await prisma.$transaction(async (prisma) => {
      // Create user-group entry
      const userGroup = await prisma.user_Group.create({
        data: {
          userId: decoded.id,
          groupId: body.groupId,
          hasSubmitted: false,
        }
      });
    
      // Create my contribution
      const myContribution = await prisma.my_Contribution.create({
        data: {
          userGroupId: userGroup.id,
          myUserReflection: '',
        }
      });
    
      // Fetch all users in the group in one query
      const allUsersInGroup = await prisma.user_Group.findMany({
        where: { groupId: body.groupId }
      });
    
      // Batch insert contribution forms for the current user
      await prisma.contribution_Forms.createMany({
        data: allUsersInGroup.map(ug => ({
          contributionsId: myContribution.id,
          groupId: body.groupId,
          targetUserId: ug.userId,
          targetUserContribution: 0,
        }))
      });
    
      // Skip if the user is the only member
      if (allUsersInGroup.length > 1) {
        const theirContributions = await prisma.my_Contribution.findMany({
          where: { userGroupId: { in: allUsersInGroup.map(ug => ug.id) } },
          select: { id: true, userGroupId: true }
        });
    
        // Map contributions to user IDs for faster lookups
        const contributionMap = new Map(theirContributions.map(c => [c.userGroupId, c.id]));
    
        // Filter out the current user and prepare bulk insert
        const contributionData = allUsersInGroup
          .filter(ug => ug.userId !== decoded.id)
          .map(ug => ({
            contributionsId: contributionMap.get(ug.id),
            groupId: body.groupId,
            targetUserId: decoded.id,
            targetUserContribution: 0,
          }))
          .filter(data => data.contributionsId); // Ensure valid entries
    
        // Batch insert instead of looping over users
        if (contributionData.length > 0) {
          await prisma.contribution_Forms.createMany({ data: contributionData });
        }
      }
    });

    return { status: 'Success', message: `` };

  } catch (e) {
    throw e;
  }
})