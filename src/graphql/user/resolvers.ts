import {
    CreateUserPayload,
    LoginPayload,
} from '../../interface/user.interface';
import { UserService } from '../../service/user.service';

const userService = new UserService();

const queries = {
    LoginValidation: async (_: any, payload: LoginPayload) => {
        try {
            const response = await userService.login(payload);
            return response;
        } catch (error) {
            throw new Error('Invalid Credentials');
        }
    },
};

const mutations = {
    createUser: async (_: any, payload: CreateUserPayload) => {
        try {
            const res = await userService.createUser(payload);
            return res.id;
        } catch (error) {
            console.error('Error creating user:', error);
            // throw error;
        }
    },
};

export const resolvers = { queries, mutations };
