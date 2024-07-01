import { ApolloServer } from '@apollo/server';
import { user } from './user/user.index';

export async function createApolloGraphqlServer() {
    try {
        // Create graphql server
        const gqlServer = new ApolloServer({
            typeDefs: `
                type Query {
                    hello: String
                }

                type Mutation {
                    ${user.mutations}
                }
            `,
            resolvers: {
                Query: {
                    ...user.resolvers.queries,
                },
                Mutation: {
                    ...user.resolvers.mutations,
                },
            },
        });
        await gqlServer.start();
        return gqlServer;
    } catch (error) {
        console.error("Error starting GraphQL server:", error);
        throw error;
    }
}
