// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { markRevised, updateReview } from '@repositories/review'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {

    const data = await request.json()
    const review = await updateReview(params.id, data)

    return NextResponse.json(review)
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const data = await request.json()
    const review = await markRevised(params.id, data)
    return NextResponse.json(review)
}