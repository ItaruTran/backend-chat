import cron from 'node-cron';

import { socketManager } from '#connector/ws.js';
import { redisClient } from '#connector/redis.js';
import { scheduledJob, scheduledTasks } from '#connector/queue-job.js';
import { setActiveUser } from '#lib/check-user-active.js';

const { schedule } = cron

export default async (_) => {
  // renew active user key
  schedule('*/4 * * * *', async () => {
    const pipeline = redisClient.pipeline()
    for (const u in socketManager.users) {
      setActiveUser({
        userId: socketManager.users[u],
        connectionId: u,
        redisCli: pipeline,
      })
    }

    const status = await pipeline.exec()
    // for (const stt of status) {
    //   if (stt[0]) console.error(stt[0]);
    // }
  })

  // auto create scheduled jobs defined in server/connector/queue-job.js
  // const currentJobs = await scheduledJob.getJobs(['delayed', 'active', 'waiting'])
  // for (const task of scheduledTasks) {
  //   if (!currentJobs.some(j => j.name === task[0]))
  //     await scheduledJob.add(task[0], {}, {
  //       repeat : { cron: task[1] },
  //     })
  // }
}
