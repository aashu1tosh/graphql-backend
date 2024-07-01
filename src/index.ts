import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { createApolloGraphqlServer } from './graphql';

async function init() {
    const app = express();
    app.use(express.json());

    // CORS Configuration
    app.use(
        cors({
            origin: '*', // Allow all origins for testing. Change this in production to specific origins.
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        })
    );

    const PORT = 8000; // Default to 8000 if PORT is not set
    const gqlServer = await createApolloGraphqlServer();
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
