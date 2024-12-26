'use server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function handleSignIn(session) {
    const cookieStore = await cookies(); // Получаем объект для работы с куками

    // Устанавливаем куки
    cookieStore.set('auth', JSON.stringify(session), {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    cookieStore.set('token', session.access_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    revalidatePath('/', "layout");
}

export async function handleSignOut() {
    const cookieStore = await cookies();
    cookieStore.delete('auth');
    cookieStore.delete('token');
    revalidatePath('/', "layout");
}
