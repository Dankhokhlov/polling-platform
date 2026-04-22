import { NextResponse } from "next/server";
import { vote } from "@/lib/polls";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { optionId } = body;

  if (!optionId) {
    return NextResponse.json(
      { error: "optionId is required" },
      { status: 400 }
    );
  }

  const poll = await vote(id, optionId);

  if (!poll) {
    return NextResponse.json(
      { error: "Poll or option not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(poll);
}
