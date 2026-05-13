import { SignJWT, jwtVerify } from 'jose';

export const ADMIN_AUTH_COOKIE = 'admin_token';

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }

    return new TextEncoder().encode(secret);
}

export async function signAdminToken(admin) {
    return new SignJWT({
        id: admin.id || admin._id.toString(),
        role: 'admin',
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(getJwtSecret());
}

export async function verifyAdminToken(token) {
    if (!token) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(token, getJwtSecret());

        if (payload.role !== 'admin' || !payload.id) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

export function setAdminAuthCookie(response, token) {
    response.cookies.set({
        name: ADMIN_AUTH_COOKIE,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });
}

export function clearAdminAuthCookie(response) {
    response.cookies.delete(ADMIN_AUTH_COOKIE);
    response.cookies.delete('admin_session');
}
