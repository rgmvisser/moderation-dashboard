import { Queue as BullQueue } from "bullmq";

import redis from "./redis.server";

type RegisteredQueue = {
  queue: BullQueue;
};

declare global {
  var __registeredQueues: Record<string, RegisteredQueue> | undefined;
}

const registeredQueues =
  global.__registeredQueues || (global.__registeredQueues = {});

export function Queue<Payload>(name: string): BullQueue<Payload> {
  if (registeredQueues[name]) {
    return registeredQueues[name].queue;
  }

  const queue = new BullQueue<Payload>(name, { connection: redis });

  registeredQueues[name] = { queue };

  return queue;
}
