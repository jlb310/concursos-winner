
const GRAPH_API = "https://graph.facebook.com/v19.0";

export async function getInstagramAccount(accessToken: string) {
    // Fetch user's pages and check for connected Instagram Business Account
    const res = await fetch(`${GRAPH_API}/me/accounts?fields=instagram_business_account,access_token,name&access_token=${accessToken}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error.message);
    if (!data.data || data.data.length === 0) throw new Error("No se encontraron Páginas de Facebook.");

    // Find the first page with a connected IG account
    const pageWithIg = data.data.find((p: any) => p.instagram_business_account);

    if (!pageWithIg) {
        throw new Error("Ninguna de tus páginas de Facebook tiene una cuenta de Instagram Business conectada.");
    }

    return {
        pageId: pageWithIg.id,
        igId: pageWithIg.instagram_business_account.id,
        pageName: pageWithIg.name,
        pageAccessToken: pageWithIg.access_token // Usually needed for higher permissions
    };
}

export async function getUserMedia(igId: string, accessToken: string) {
    const res = await fetch(`${GRAPH_API}/${igId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${accessToken}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error.message);
    return data.data || [];
}

export async function getPostComments(mediaId: string, accessToken: string) {
    let allComments: any[] = [];
    let nextUrl = `${GRAPH_API}/${mediaId}/comments?fields=from,text,timestamp,username&limit=50&access_token=${accessToken}`;

    // Simple pagination (limit to 5 pages / 250 comments for safety in this demo)
    let pages = 0;
    while (nextUrl && pages < 5) {
        const res = await fetch(nextUrl);
        const data = await res.json();

        if (data.error) throw new Error(data.error.message);

        if (data.data) {
            allComments = [...allComments, ...data.data];
        }

        nextUrl = data.paging?.next;
        pages++;
    }

    return allComments.map(c => ({
        id: c.id,
        username: c.username || c.from?.username || "Usuario",
        comment: c.text,
        timestamp: c.timestamp,
        // Since API doesn't return avatar easily without extra calls, use placeholder
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.username || c.from?.username || "User"}`
    }));
}
