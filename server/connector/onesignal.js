import OneSignal from 'onesignal-node';
import { onesignal } from '#sv/env.js';
import { queueJob } from '#connector/queue-job.js'

const client = new OneSignal.Client(onesignal.appId, onesignal.apiKey);

/**
 * @param {import('onesignal-node/lib/types').CreateNotificationBody} notification
 */
export function sendNotification(notification) {
  return queueJob.add('onesignal', { notification })
}

/**
 * @param {import('onesignal-node/lib/types').CreateNotificationBody} notification
 */
export async function createNotification(notification) {
  if (!onesignal.appId) return
  if (!notification.filters)
    notification.included_segments = ['Subscribed Users']

  if (!notification.ios_badgeType) {
    notification.ios_badgeType = 'Increase'
    notification.ios_badgeCount = 1
  }

  if (!notification.priority)
    notification.priority = 10

  try {
    const response = await client.createNotification(notification);

    if (response.body.warnings)
      console.error('warnings', response.body.warnings);
    if (response.body.errors)
      console.error('errors', response.body.errors);

    return response.body.id
  } catch (e) {
    if (e.body) {
      console.error('error', e.body);
    } else {
      console.error('error', e);
    }
  }
}

/**
 * @param {string[]} ids
 * @returns {any[]}
 */
export function getFilterUUID(ids) {
  const filters = [{ "field": "tag", "key": "user_uuid", "relation": "=", "value": ids.pop() }]

  for (const id of ids) {
    filters.push({ "operator": "OR" })
    filters.push({ "field": "tag", "key": "user_uuid", "relation": "=", "value": id })
  }

  return filters
}