import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // TODO: Verify Svix signature and handle Clerk webhook events
  const payload = await req.json()
  console.log('Clerk webhook received:', payload.type)
  return NextResponse.json({ received: true })
}
