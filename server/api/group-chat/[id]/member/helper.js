import {Member} from '#models';
import {ForbiddenError} from '#utils/error.js';

export async function checkMemberGroup(req) {
  const member = await Member.findOne({
    where: {
      group_id: req.params.id,
      member_id: req.userId,
    },
  })

  if (!member)
    throw new ForbiddenError('Not have permission to do this')

  return member
}