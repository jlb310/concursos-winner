import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getInstagramAccount, getUserMedia } from "@/lib/instagram";

export async function GET() {
    try {
        const session: any = await getServerSession(authOptions);

        if (!session || !session.accessToken) {
            return NextResponse.json({ error: 'No autorizado. Por favor inicia sesión.' }, { status: 401 });
        }

        const { igId } = await getInstagramAccount(session.accessToken);
        const media = await getUserMedia(igId, session.accessToken);

        return NextResponse.json({ posts: media });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}
