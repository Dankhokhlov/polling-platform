import { NextResponse } from "next/server";
import { createPoll, getAllPolls } from "@/lib/polls";

export async function GET() {
  const polls = await getAllPolls();
  return NextResponse.json(polls);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, options } = body;

  if (!title || !options || !Array.isArray(options) || options.length < 2) {
    return NextResponse.json(
      { error: "Title and at least 2 options are required" },
      { status: 400 }
    );
  }

  const cleaned = options
    .map((o: string) => o.trim())
    .filter((o: string) => o.length > 0);
  if (cleaned.length < 2) {
    return NextResponse.json(
      { error: "At least 2 non-empty options are required" },
      { status: 400 }
    );
  }

  const poll = await createPoll(title.trim(), cleaned);
  return NextResponse.json(poll, { status: 201 });
}
