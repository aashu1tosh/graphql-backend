import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { DotenvConfig } from './config/env.config';
import playground from 'graphql-playground-middleware-express';

async function init() {
    const app = express();
    app.use(express.json());
    app.use(morgan('common'));

    // CORS Configuration
    app.use(cors({
        origin: '*', // Allow all origins for testing. Change this in production to specific origins.
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    const PORT = DotenvConfig.PORT || 4000; // Default to 4000 if PORT is not set

    // Create graphql server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
        `, // Schema as a string
        resolvers: {
            Query: {
                hello: () => `Hey there, I am a graphql Server`,
                say: (_, {name}: {name: string}) => `Hey ${name}, How are you?`
            }
        }, // Functions that will execute
    });

    await gqlServer.start();

    app.use('/graphql', expressMiddleware(gqlServer));
    app.get('/playground', playground({ endpoint: '/graphql' }));

    app.get('/', (req, res) => {
        res.json({ message: "Server running on port " + PORT });
    });

    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
        console.log(`GraphQL Playground: http://localhost:${PORT}/playground`);
    });
}

init().catch(error => {
    console.error('Error starting the server:', error);
});
