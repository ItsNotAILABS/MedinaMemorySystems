import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Task {
  id: string;
  title: string;
  done?: string;
  createdAt: string;
}

const store: Task[] = [];

export async function GET() {
  return NextResponse.json({ items: store });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item: Task = {
    id: crypto.randomUUID(),
    ...body,
    createdAt: new Date().toISOString(),
  };
  store.push(item);
  return NextResponse.json(item, { status: 201 });
}
