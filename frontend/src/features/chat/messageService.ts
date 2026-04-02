export async function sendMessage(chatId: string, content: string, replyToId?: string) {
    const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chatId,
            content,
            replyToId: replyToId ?? null,
        }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function editMessage(messageId: string, content: string) {
    const res = await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function deleteMessage(messageId: string) {
    const res = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error(await res.text());
}