import {GroupChat} from '#models';
import {ForbiddenError} from '#utils/error.js';

/**
 * check user is owner of this chat or this chat exists
 * @param {*} req
 * @param {{
 *   checkOwner?: boolean;
 *   throwErr?: boolean;
 * }} [param1]
 * @returns
 */
export async function checkGroupChat(req, {checkOwner=true, throwErr=true} = {}) {
  const where = {
    friend_id: null,
    id: req.params.id,
  }
  if (checkOwner)
    where.owner_id = req.userId

  const group = await GroupChat.findOne({
    where,
  })

  if (!group) {
    if (throwErr)
      throw new ForbiddenError('Not have permission to edit group')
    return null
  }

  return group
}
