import { getRedis } from "./redis";
import { v4 as uuidv4 } from "uuid";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  options: PollOption[];
  createdAt: number;
  totalVotes: number;
}

const POLLS_LIST_KEY = "polls:list";
const pollKey = (id: string) => `poll:${id}`;

export async function createPoll(
  title: string,
  options: string[]
): Promise<Poll> {
  const redis = getRedis();
  const id = uuidv4().slice(0, 8);

  const poll: Poll = {
    id,
    title,
    options: options.map((text) => ({
      id: uuidv4().slice(0, 8),
      text,
      votes: 0,
    })),
    createdAt: Date.now(),
    totalVotes: 0,
  };

  await redis.set(pollKey(id), JSON.stringify(poll));
  await redis.lpush(POLLS_LIST_KEY, id);

  return poll;
}

export async function getPoll(id: string): Promise<Poll | null> {
  const redis = getRedis();
  const data = await redis.get<string>(pollKey(id));
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : data;
}

export async function getAllPolls(): Promise<Poll[]> {
  const redis = getRedis();
  const ids = await redis.lrange(POLLS_LIST_KEY, 0, -1);
  if (!ids || ids.length === 0) return [];

  const polls: Poll[] = [];
  for (const id of ids) {
    const poll = await getPoll(id as string);
    if (poll) polls.push(poll);
  }

  return polls;
}

export async function vote(
  pollId: string,
  optionId: string
): Promise<Poll | null> {
  const redis = getRedis();
  const poll = await getPoll(pollId);
  if (!poll) return null;

  const option = poll.options.find((o) => o.id === optionId);
  if (!option) return null;

  option.votes += 1;
  poll.totalVotes += 1;

  await redis.set(pollKey(pollId), JSON.stringify(poll));
  return poll;
}
