import { ApolloServer } from '@apollo/server';
import { prismaClient } from '../lib/db';
import { user } from './user/index';

export async function createApolloGraphqlServer() {
    // Create graphql server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
            }

            type Mutation {
                ${user.mutations}
            }
        `, // Schema as a string
        resolvers: {
            Query: {
                ...user.resolvers.queries,
            },

            Mutation: {
                ...user.resolvers.mutations,
            },
        }, // Functions that will execute
    });

    await gqlServer.start();

    return gqlServer;
}
