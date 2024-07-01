import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { prismaClient } from './lib/db';

async function init() {
    const app = express();
    app.use(express.json());
    app.use(morgan('common'));

    // CORS Configuration
    app.use(
        cors({
            origin: '*', // Allow all origins for testing. Change this in production to specific origins.
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        })
    );

    const PORT = 8000; // Default to 4000 if PORT is not set

    // Create graphql server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }

            type Mutation {
                createUser(firstName: String!, lastName: String!, email:String!, password: String!): Boolean
            }
        `, // Schema as a string
        resolvers: {
            Query: {
                hello: () => `Hey there, I am a graphql Server`,
                say: (_, { name }: { name: string }) =>
                    `Hey ${name}, How are you?`,
            },

            Mutation: {
                createUser: async (
                    _,
                    {
                      firstName,
                      lastName,
                      email,
                      password,
                    }: {
                      firstName: string;
                      lastName: string;
                      email: string;
                      password: string;
                    },
                  ) => {
                    try {
                      await prismaClient.user.create({
                        data: {
                          firstName,
                          lastName,
                          email, // Include the email field here
                          password,
                          salt: "random_salt",
                        },
                      });
                      return true;
                    } catch (error) {
                      console.error("Error creating user:", error);
                      return false; // You might want to return a specific error message instead
                    }
                  },
            },
        }, // Functions that will execute
    });

    await gqlServer.start();

    app.use('/graphql', expressMiddleware(gqlServer));

    app.get('/', (req, res) => {
        res.json({ message: 'Server running on port ' + PORT });
    });

    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
}

init().catch((error) => {
    console.error('Error starting the server:', error);
});
