import { attachHandler, backgroundJobs } from '#connector/queue-job.js'
import { socketManager } from '#connector/ws.js'

main()
async function main() {
  socketManager.initWorker()
  await attachHandler()
  console.log(`Started worker`);

  process.on('SIGTERM', () => {
    console.log('Process SIGTERM');
    console.log(`Worker exiting...`);
    shutdown(0);
  });
}

async function shutdown(code) {
  setTimeout(() => {
    console.warn(`Couldn't pause all queues within 10s, sorry! Exiting.`);
    process.exit(1);
  }, 10000);

  await Promise.all(backgroundJobs.map(j => j.close()))
  console.log('Queue closed');
  process.exit(code);
}
