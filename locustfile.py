from asyncio.tasks import Task
from random import randint
from threading import Thread, Lock
from asyncio import get_event_loop, new_event_loop, set_event_loop, Queue, create_task
from typing import List, Protocol

from locust import HttpUser, task, between
from websockets import connect

token = [
    'OIODknSFBLVDX2o7hytO3ABQNT6b6xVQomcFa1OSBzreh2ncGZnX4dVdDAr8GVTF',
    'RR3YMdLuPN8D3kKa7tnP6ZAh3RRGFKmVhvBRN8SZFyPzxLh3nOdndQjPFbR94DZO',
    'r1YlRFGnGhYVFwX4d1Hz5iFcHS28WERXlLOZSkUQFrF94VltqNlMQzOSyJBSOhit',
]

class MyUser(HttpUser):
    wait_time = between(0.1, 0.2)

    @task(1)
    def get_friends(self):
        self.client.get(
            "/api/friend-list",
            headers={
                'authorization': self.user_token,
            },
        )

    @task(1)
    def get_bills(self):
        self.client.get(
            '/api/message',
            headers={
                'authorization': self.user_token,
            },
        )

    @task(40)
    def buy_film(self):
        self.client.post(
            '/api/message',
            json={
                'friendship_id': self.friends,
                'content': 'awefawefawefwaefawefawefawefawef awefawef awef awef awef awef awef',
            },
            headers={
                'authorization': self.user_token,
            },
        )
        self.send_count += 1

    def on_start(self):
        self.user_token = randint(1, 999999)
        self.client.get(f'/api/v1/users/{self.user_token}')
        self.send_count = 0
        self.event_count = 0

        # self.thr = Thread(target=run_handler, args=(self,))
        # self.thr.start()

    def on_stop(self):
        if (getattr(self, 'thr', None)) is None: return

        self.thr.join()

        if self.send_count == 0 and self.event_count == 0: return

        with open(f'./.data/{self.user_token}.log', 'w') as f:
            f.write(f'{self.send_count == self.event_count}\nevent_count {self.event_count}\nsend_count {self.send_count}')

class WSM:
    def __init__(self) -> None:
        self.is_running = False
        self.t: List[Task] = []

        self.thr = Thread(target=self.run_handler)
        self.thr.start()

    def stop(self):
        self.is_running = False
        for t in self.t:
            t.cancel()

        self.thr.join()

    def run_handler(self):
        try:
            loop = get_event_loop()
        except RuntimeError:
            loop = new_event_loop()
            set_event_loop(loop)

        loop.run_until_complete(self.main())

    async def main(self):
        self.queue = Queue()
        self.is_running = True

        while self.is_running:
            user = await self.queue.get()
            self.t.append(create_task(self.connect_ws(user)))

    async def connect_ws(self, user):
        url = user.host.replace('http://', '')
        async with connect(f'ws://{url}/api/v1/ws/{user.user_token}', extra_headers=dict(token=str(user.user_token))) as ws:
            try:
                while True:
                    await ws.recv()
                    user.event_count += 1
            except:
                pass
