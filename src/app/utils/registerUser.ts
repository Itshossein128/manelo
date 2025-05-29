import { saltAndHashPassword } from '@/utils/password';
import client from '@/utils/db';

interface User {
    _id: string;
    email: string;
    name: string;
    passwordHash: string;
    role?: string;
    createdAt: Date;
}

export async function registerUser(email: string, password: string, name: string): Promise<User> {
    const passwordHash = await saltAndHashPassword(password);
    const db = client.db();

    const newUser = {
        email,
        name,
        passwordHash,
        role: 'user',
        createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);
    
    return {
        _id: result.insertedId.toString(),
        ...newUser
    } as User;
}