import { CreateUserPayload, LoginPayload } from '../interface/user.interface';
import { prismaClient } from '../lib/db';
import bcryptServiceObj from './bcrypt.service';

export class UserService {
    async createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
        const hashedPassword = await bcryptServiceObj.hash(password);
        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
            },
        });
    }

    async login(payload: LoginPayload) {
        try {
            const { email, password } = payload;
            const user = await prismaClient.user.findUnique({
                where: {
                    email: email, // Assuming email is the unique field in your User model
                },
            });
            if (user) {
                const validCredential = await bcryptServiceObj.compare(
                    password,
                    user.password
                );
                if (validCredential) return 'true';
                return 'false';
            } else {
                throw new Error('Invalid Credentials');
            }
        } catch (error) {
            throw new Error('Invalid Credentials');
        }
    }
}
