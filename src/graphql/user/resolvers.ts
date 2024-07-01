import { CreateUserPayload } from "../../interface/user.interface";
import { UserService } from "../../service/user.service";

const queries = {};

const userService = new UserService();

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
