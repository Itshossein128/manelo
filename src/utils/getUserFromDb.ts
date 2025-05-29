// utils/getUserFromDb.js
import client from '@/utils/db';

interface User {
  _id: string;
  email: string;
  passwordHash: string;
  role?: string;
}

export async function getUserFromDb(email: string, passwordHash: string): Promise<User | null> {
    const db = client.db();
    const user = await db.collection('users').findOne({ email, passwordHash }) as User | null;
    return user;
}