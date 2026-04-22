import { NextResponse } from "next/server";
import { getPoll, deletePoll } from "@/lib/polls";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const poll = await getPoll(id);

  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  return NextResponse.json(poll);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deletePoll(id);

  if (!deleted) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
