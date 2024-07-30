# ElysiaJS MVC Implementation

This guide provides comprehensive instructions for setting up an ElysiaJS application, including integration with DTOs, Mongoose, Swagger, WebSocket, Cron Jobs, and GraphQL.

Table of Contents

    1.	Introduction
	2.	Folder Structure
	3.	Setting Up ElysiaJS
	4.	Creating DTO Models
	5.	Defining Controllers
	6.	Implementing Services
	7.	Connecting to MongoDB
	8.	Integrating Swagger
	9.	Running the Application
	10.	WebSocket Implementation
	11.	Cron Job Implementation
	12.	GraphQL Integration
	13.	Sample Code

## Introduction

This manual guides you through setting up an ElysiaJS application with Data Transfer Objects (DTOs), Mongoose for MongoDB, Swagger for API documentation, WebSocket for real-time communication, Cron Jobs for scheduled tasks, and GraphQL for flexible queries.

### Folder Structure

```bash
project-root/
│
├── src/
│   ├── modules/
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── user.schema.ts
|   |   |   |── user.resolver.ts
│   │   │   ├── user.service.ts
│   │   │   ├── dtos/
│   │   │       ├── user.input.dto.ts
│   │   │
│   │   ├── products/
│   │   │   ├── products.controller.ts
│   │   │   ├── product.schema.ts
|   |   |   |── product.resolver.ts
│   │   │   ├── product.service.ts
│   │   │   ├── dtos/
│   │   │       ├── product.input.dto.ts
│   │   │
│   ├── config/
│   │   └── database.js
│   │   └── logger.ts
│   │
│   ├── graphql/
│   │   ├── schema.js
│   │   └── index.js
│   │
│   ├── websocket/
│   │   ├── websocket.js
│   │   └── websocket-manager.js
│   │
│   ├── cron.ts
│   ├── app.js
│   └── client.js
│
├── package.json
├── README.md
└── .gitignore
```

### Setting Up ElysiaJS

**1.	Install ElysiaJS:**

```bash
yarn add elysia
```

**2.	Create an Elysia Instance:**
        Initialize the Elysia application in app.js:

```typescript
import { Elysia } from 'elysia';

const app = new Elysia();
```

### Creating DTO Models

DTOs define the structure and validation rules for request and response data.

**User Input DTO:**

```typescript
import { Elysia, t } from 'elysia';

const UserInputDTO = new Elysia({ name: 'Model.UserInput' })
    .model({
        'user.create': t.Object({
            name: t.String(),
            email: t.String({ format: 'email' })
        })
    });

export default UserInputDTO;
```

**User Response DTO:**

```typescript
import { Elysia, t } from 'elysia';

const UserResponseDTO = new Elysia({ name: 'Model.UserResponse' })
    .model({
        'user.response': t.Object({
            id: t.String(),
            name: t.String(),
            email: t.String({ format: 'email' })
        })
    });

export default UserResponseDTO;
```

### Defining Controllers

Controllers manage incoming requests and responses, using DTOs for validation.

**Users Controller:**

```typescript
import { Elysia } from 'elysia';
import UserInputDTO from '../dtos/user.input.dto';
import UserResponseDTO from '../dtos/user.response.dto';

const usersController = (services) => {
  const app = new Elysia({ prefix: '/users' });

  app
    .use(UserInputDTO)
    .use(UserResponseDTO)
    .post('/create', async ({ body }) => {
      const user = await services.createUser(body);
      return { id: user._id, name: user.name, email: user.email };
    }, {
      body: 'user.create',
      response: 'user.response'
    })
    .get('/', async ({ response }) => {
      const users = await services.getUsers();
      response.send(users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email
      })));
    })
    .get('/:id', async ({ params, response }) => {
      const user = await services.getUserById(params.id);
      if (user) {
        response.send({
          id: user._id,
          name: user.name,
          email: user.email
        });
      } else {
        response.status(404).send({ error: 'User not found' });
      }
    });

  return app;
};

export default usersController;
```

### Implementing Services

Define your services in separate files.
user.service.js:

```typescript
import { Elysia } from 'elysia';

const userService = new Elysia();

userService.decorate('getUsers', () => {
  return ['User1', 'User2', 'User3'];
});

userService.decorate('getUserById', (id) => {
  return { id, name: `User${id}` };
});

export default userService;
```

product.service.js:

```typescript
import { Elysia } from 'elysia';

const productService = new Elysia();

productService.decorate('getProducts', () => {
  return ['Product1', 'Product2', 'Product3'];
});

productService.decorate('getProductById', (id) => {
  return { id, name: `Product${id}` };
});

export default productService;
```

**Inject services into controllers.**

```typescript
import { Elysia } from 'elysia';

const usersController = (services) => {
  const app = new Elysia();

  app
    .get('/users', ({ response }) => {
      const users = services.getUsers();
      response.send(users);
    })
    .get('/users/:id', ({ params, response }) => {
      const user = services.getUserById(params.id);
      response.send(user);
    })
    .post('/users', ({ body, response }) => {
      response.send(`This action creates a new user with the following data: ${JSON.stringify(body)}`);
    });

  return app;
};

export default usersController;
```

**Combine Controllers and Services in the Main Application:**
app.js:

```typescript
import { Elysia } from 'elysia';
import swaggerPlugin from 'elysia-swagger'; // Example plugin, replace with actual one if different
import userService from './user.service';
import productService from './product.service';
import usersController from './users.controller';
import productsController from './products.controller';

const app = new Elysia();

// Use services as middleware
app.use(userService);
app.use(productService);

// Inject services into controllers and use them
app.use(usersController(userService));
app.use(productsController(productService));

// Apply Swagger plugin
app.use(swaggerPlugin({
  swaggerOptions: {
    title: 'My API',
    version: '1.0.0',
  },
  routePrefix: '/docs', // Swagger UI will be available at /docs
}));

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
  console.log('Swagger docs are available at http://localhost:3000/docs');
});
```

### Connecting to MongoDB

Ensure Mongoose connects to MongoDB. Place this code in config/database.js:

```typescript
import mongoose from 'mongoose';

const connectToDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export { connectToDatabase };
```

**use in your services**

```typescript
import mongoose from 'mongoose';
import UserModel from '../models/user.model';
import { Elysia } from 'elysia';

const userService = new Elysia();

userService.decorate('createUser', async () => {
  const user = new UserModel(data);
    return await user.save();
});

userService.decorate('getUsers', async () => {
   return await UserModel.find();
});


export default userService;

```

### Integrating Swagger

Swagger provides API documentation. Use the elysia-swagger plugin.

Setup Swagger in app.js:

```typescript
import { Elysia } from 'elysia';
import swaggerPlugin from 'elysia-swagger';
import { connectToDatabase } from './config/database';
import userModule from './modules/users';
import productModule from './modules/products';

// Connect to MongoDB
connectToDatabase();

const app = new Elysia();

// Use services as middleware
app.use(userModule.service);
app.use(productModule.service);

// Inject services into controllers and use them
app.use(userModule.controller(userModule.service));
app.use(productModule.controller(productModule.service));

// Apply Swagger plugin
app.use(swaggerPlugin({
  swaggerOptions: {
    title: 'My API',
    version: '1.0.0',
  },
  routePrefix: '/docs',
}));

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
  console.log('Swagger docs are available at http://localhost:3000/docs');
});
```

### WebSocket Implementation

```bash
src/
|-- websocket/
|   |-- websocket.js
|   |-- websocket-manager.js
|-- services/
|   |-- userService.js
|   |-- productService.js
|   |-- messageHandlers.js
|-- app.js
|-- client.js
```

**WebSocket Manager (src/websocket/websocket-manager.js):**

```typescript
const connections = new Map();

export function addConnection(id, ws) {
    connections.set(id, ws);
}

export function removeConnection(id) {
    connections.delete(id);
}

export function getConnection(id) {
    return connections.get(id);
}

export function sendToConnection(id, message) {
    const ws = getConnection(id);
    if (ws) {
        ws.send(JSON.stringify(message));
    } else {
        console.log(`No connection found for id: ${id}`);
    }
}

export function broadcast(message) {
connections.forEach(ws => ws.send(JSON.stringify(message)));
}
```

**WebSocket Setup (src/websocket/websocket.js)**:

```typescript
import WebSocket from 'ws';
import { addConnection, removeConnection, broadcast } from './websocket-manager';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
    const id = req.headers['sec-websocket-key'];
    addConnection(id, ws);

    ws.on('message', message => {
        const data = JSON.parse(message);
        // Handle incoming message
        console.log(`Received message: ${data}`);
        broadcast(data); // Broadcast received message to all connections
    });

    ws.on('close', () => {
        removeConnection(id);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
```

Client-Side Implementation

```typescript
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
    console.log('WebSocket connection opened');
    ws.send(JSON.stringify({ type: 'greeting', message: 'Hello Server!' }));
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received from server:', data);
};

ws.onclose = () => {
    console.log('WebSocket connection closed');
};

ws.onerror = (error) => {
    console.log('WebSocket error:', error);
};
```

### Cron Job Implementation User Manual

Overview

This manual provides details on integrating cron jobs into an ElysiaJS application with a module-based folder structure. It includes configuration for cron jobs, interaction with services, and WebSocket integration.

```bash
src/
|-- websocket/
|   |-- websocket.js
|   |-- websocket-manager.js
|-- modules/
|   |-- user/
|   |   |-- user.controller.js
|   |   |-- user.service.js
|   |   |-- user.dtos.js
|   |-- product/
|   |   |-- product.controller.js
|   |   |-- product.service.js
|   |   |-- product.dtos.js
|-- cron.ts
|-- app.js
|-- client.js
```

Cron Job Configuration

1. Cron Job File (src/cron.ts)

   This file sets up the cron job that runs at specified intervals, integrating with the user and product services to perform tasks such as checking for updates or sending notifications.

```typescript
import { Elysia, cron } from 'elysia';
import { userService } from './modules/user/user.service';
import { productService } from './modules/product/product.service';

const app = new Elysia();

// Define a cron job to run every 10 seconds
app.use(
    cron({
        name: 'heartbeat',
        pattern: '*/10 * * * * *', // Every 10 seconds
        async run() {
            console.log('Heartbeat');

            // Check for user updates
            try {
                const usersWithUpdates = await userService.checkForUpdates();
                usersWithUpdates.forEach(user => {
                    console.log(`User update: ${JSON.stringify(user)}`);
                });
            } catch (error) {
                console.error('Error checking for user updates:', error);
            }

            // Check for product updates
            try {
                const productsWithUpdates = await productService.checkForUpdates();
                productsWithUpdates.forEach(product => {
                    console.log(`Product update: ${JSON.stringify(product)}`);
                });
            } catch (error) {
                console.error('Error checking for product updates:', error);
            }

            // Send notifications
            try {
                const notifications = await userService.getPendingNotifications();
                notifications.forEach(notification => {
                    console.log(`Sending notification: ${JSON.stringify(notification)}`);
                });
            } catch (error) {
                console.error('Error sending notifications:', error);
            }
        }
    })
);

app.use(userController);
app.use(productController);

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
```

### GraphQL Integration with ElysiaJS

Overview

This manual describes how to integrate GraphQL with an ElysiaJS application. It includes setting up GraphQL schema and resolvers, and integrating them with ElysiaJS.

**Folder Structure**

Ensure your project follows this folder structure:

```bash
src/
|– graphql/
|   |– resolvers/
|   |   |– user.resolver.js
|   |   |– product.resolver.js
|   |– schema.js
|   |– index.js
|– modules/
|   |– user/
|   |   |– user.controller.js
|   |   |– user.service.js
|   |   |– user.dtos.js
|   |– product/
|   |   |– product.controller.js
|   |   |– product.service.js
|   |   |– product.dtos.js
|– cron.ts
|– app.js
```

### Installation

Install the necessary dependencies for GraphQL:

```bash
npm install graphql apollo-server
```

Setting Up GraphQL

1. Define GraphQL Schema

Create a schema file to define your types and operations.

src/graphql/schema.js

```typescript
import { gql } from 'apollo-server';

const typeDefs = gql`
  type Query {
    users: [User]
    products: [Product]
    user(id: ID!): User
    product(id: ID!): Product
  }

  type Mutation {
    createUser(name: String!): User
    createProduct(name: String!): Product
  }

  type User {
    id: ID!
    name: String!
  }

  type Product {
    id: ID!
    name: String!
  }
`;

export default typeDefs;
```

2. Implement GraphQL Resolvers

Create resolver files to handle the logic for your queries and mutations.

User Resolver (src/graphql/resolvers/user.resolver.js):

```typescript

import { userService } from '../modules/user/user.service';

const userResolver = {
  Query: {
    users: async () => await userService.getUsers(),
    user: async (_, { id }) => await userService.getUserById(id),
  },
  Mutation: {
    createUser: async (_, { name }) => await userService.createUser({ name }),
  },
};

export default userResolver;
```

3. Combine Resolvers and Schema

Combine the schema and resolvers to create an Apollo Server instance.

src/graphql/index.js

```typescript

import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import userResolver from './resolvers/user.resolver';
import productResolver from './resolvers/product.resolver';

const resolvers = {
  ...userResolver,
  ...productResolver,
};

const server = new ApolloServer({ typeDefs, resolvers });

export default server;
```

4. Integrate GraphQL with ElysiaJS

Update your main application file to include the GraphQL server middleware.

src/app.js

```typescript
import { Elysia } from 'elysia';
import server from './graphql/index';

const app = new Elysia();

// Set up the HTTP server to work with Apollo Server
server.applyMiddleware({ app, path: '/graphql' });

// Add your HTTP routes and middleware
// Example of adding a REST endpoint
app.get('/api/hello', (req, res) => {
  res.send('Hello World');
});

// Listen to the server
app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
  console.log(`GraphQL Playground available at http://localhost:3000/graphql`);
});
```

Testing GraphQL

Use a GraphQL client or playground to test your GraphQL API. Access the GraphQL playground at:
