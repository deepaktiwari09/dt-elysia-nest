## User Manual: ElysiaJS Implementation with DTOs, Mongoose, and Swagger

## Table of Contents

1. [Introduction](#introduction)
2. [Folder Structure](#folder-structure)
3. [Setting Up ElysiaJS](#setting-up-elysiajs)
4. [Creating DTO Models](#creating-dto-models)
5. [Defining Controllers](#defining-controllers)
6. [Implementing Services](#implementing-services)
7. [Connecting to MongoDB](#connecting-to-mongodb)
8. [Integrating Swagger](#integrating-swagger)
9. [Running the Application](#running-the-application)
10. [Sample Code](#sample-code)

---

## Introduction

This manual provides a comprehensive guide for setting up a modular ElysiaJS application with support for Data Transfer Objects (DTOs), Mongoose for MongoDB interaction, and Swagger for API documentation.

## Folder Structure

The recommended folder structure for your project is as follows:

```bash
project-root/
│
├── src/
│   ├── modules/
│   │   ├── users/
│   │   │   ├── controllers/
│   │   │   │   └── users.controller.js
│   │   │   ├── models/
│   │   │   │   └── user.model.js
│   │   │   ├── services/
│   │   │   │   └── user.service.js
│   │   │   ├── dtos/
│   │   │   │   ├── user.input.dto.js
│   │   │   │   └── user.response.dto.js
│   │   │   └── index.js
│   │   │
│   │   ├── products/
│   │   │   ├── controllers/
│   │   │   │   └── products.controller.js
│   │   │   ├── models/
│   │   │   │   └── product.model.js
│   │   │   ├── services/
│   │   │   │   └── product.service.js
│   │   │   ├── dtos/
│   │   │   │   ├── product.input.dto.js
│   │   │   │   └── product.response.dto.js
│   │   │   └── index.js
│   │   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── app.js
│
├── package.json
├── README.md
└── .gitignore
```

## Setting Up ElysiaJS

1. **Install ElysiaJS**: Use npm or yarn to install ElysiaJS in your project.

   ``bash
   npm install elysia
   ``
  	2.	Create an Elysia Instance: Initialize the Elysia application in app.js.

Creating DTO Models

DTOs (Data Transfer Objects) define the structure and validation rules for request and response data.

Input DTO Example (User):

**src/modules/users/dtos/user.input.dto.js:**

```typescript
import { Elysia, t } from 'elysia';

const UserInputDTO = new Elysia({ name: 'Model.UserInput' })
    .model({
        'user.create': t.Object({
            name: t.String(),
            email: t.String({
                format: 'email'
            })
        })
    });

export default UserInputDTO;
```

Response DTO Example (User):

**src/modules/users/dtos/user.response.dto.js:**

```typescript
import { Elysia, t } from 'elysia';

const UserResponseDTO = new Elysia({ name: 'Model.UserResponse' })
    .model({
        'user.response': t.Object({
            id: t.String(),
            name: t.String(),
            email: t.String({
                format: 'email'
            })
        })
    });

export default UserResponseDTO;
```
Defining Controllers

Controllers manage incoming requests and send responses. They use DTOs for validation.

Users Controller Example:

**src/modules/users/controllers/users.controller.js:**

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

Implementing Services

Services handle business logic and database interactions.

User Service Example:

**src/modules/users/services/user.service.js:**

```typescript
import mongoose from 'mongoose';
import UserModel from '../models/user.model';

const userService = {
  async createUser(data) {
    const user = new UserModel(data);
    return await user.save();
  },

  async getUsers() {
    return await UserModel.find();
  },

  async getUserById(id) {
    return await UserModel.findById(id);
  }
};

export default userService;
```
Connecting to MongoDB

Ensure Mongoose connects to MongoDB only once. Place this code in config/database.js.

**src/config/database.js:**

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

Integrating Swagger

Swagger provides API documentation. Use the elysia-swagger plugin (replace with actual if different).

**src/app.js:**

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

### Running the Application

Start the Application: Use the following command to run your application.

```bash
bun src/app.js
```

**Access Swagger Documentation**: Open your browser and navigate to http://localhost:3000/docs to view the API documentation.



# WebSocket Implementation User Manual

**Overview**

This manual outlines the implementation of WebSocket communication using ElysiaJS, with a single base WebSocket URL. It covers server-side and client-side code, and includes a file structure overview.

**File Structure**
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

**Server-Side Implementation**

1. WebSocket Manager (src/websocket/websocket-manager.js)

Handles WebSocket connections and broadcasting messages.

```typescript
const connections = new Map(); // Map to store WebSocket connections

/**
 * Add a WebSocket connection to the connections map.
 * @param {string} id - The unique ID for the connection.
 * @param {WebSocket} ws - The WebSocket connection object.
 */
export function addConnection(id, ws) {
    connections.set(id, ws);
}

/**
 * Remove a WebSocket connection from the connections map.
 * @param {string} id - The unique ID for the connection.
 */
export function removeConnection(id) {
    connections.delete(id);
}

/**
 * Get a WebSocket connection from the connections map.
 * @param {string} id - The unique ID for the connection.
 * @returns {WebSocket | undefined} - The WebSocket connection object or undefined if not found.
 */
export function getConnection(id) {
    return connections.get(id);
}

/**
 * Send a message to a specific WebSocket connection.
 * @param {string} id - The unique ID for the connection.
 * @param {Object} message - The message to send.
 */
export function sendToConnection(id, message) {
    const ws = getConnection(id);
    if (ws) {
        ws.send(JSON.stringify(message));
    } else {
        console.log(`No connection found for id: ${id}`);
    }
}

/**
 * Broadcast a message to all WebSocket connections.
 * @param {Object} message - The message to broadcast.
 */
export function broadcast(message) {
    connections.forEach(ws => ws.send(JSON.stringify(message)));
}
```

**2. WebSocket Handler (src/websocket/websocket.js)**

Sets up the WebSocket server and routes messages based on type.
```typescript
import { Elysia, t } from 'elysia';
import { addConnection, removeConnection, sendToConnection, broadcast } from './websocket-manager';
import { handleUserMessage, handleProductMessage } from '../services/messageHandlers';

// Create a single WebSocket instance
const websocketApp = new Elysia();

// WebSocket endpoint with base URL
websocketApp.ws('/ws', {
    body: t.Object({
        type: t.String(), // Type of message (e.g., 'user', 'product')
        id: t.String(), // ID for routing messages
        data: t.Any()   // The message data
    }),

    open(ws) {
        console.log('Client connected');
        // Optionally send a welcome message
        ws.send({
            type: 'info',
            message: 'Connection established'
        });
    },

    message(ws, { type, id, data }) {
        switch (type) {
            case 'user':
                handleUserMessage(id, data);
                break;
            case 'product':
                handleProductMessage(id, data);
                break;
            default:
                console.log('Unknown message type:', type);
        }
    },

    close(ws) {
        console.log('Client disconnected');
        // Optionally handle disconnection logic
    }
});

export default websocketApp;
```

**3. Message Handlers (src/services/messageHandlers.js)**

Routes messages to specific services and emits events.

```typescript
import { sendToConnection, broadcast } from '../websocket/websocket-manager';
import { userService } from './userService';
import { productService } from './productService';

// Handle user-related messages
export function handleUserMessage(id, data) {
    if (data.action === 'update') {
        userService.updateUser(id, data.payload);
    } else if (data.action === 'create') {
        userService.createUser(id, data.payload);
    }

    // Broadcast an event to all clients
    broadcast({
        type: 'user',
        id,
        data: {
            action: 'user_updated',
            payload: data.payload
        }
    });
}

// Handle product-related messages
export function handleProductMessage(id, data) {
    if (data.action === 'update') {
        productService.updateProduct(id, data.payload);
    } else if (data.action === 'create') {
        productService.createProduct(id, data.payload);
    }

    // Broadcast an event to all clients
    broadcast({
        type: 'product',
        id,
        data: {
            action: 'product_updated',
            payload: data.payload
        }
    });
}
```
**Main App File (src/app.js)**

Sets up the main application and integrates the WebSocket handler.
```
import { Elysia } from 'elysia';
import websocketApp from './websocket/websocket';

// Create the main Elysia application instance
const app = new Elysia();

// Use the WebSocket instance
app.use(websocketApp);

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
```

**Client-Side Implementation**

**Client-Side (client.js)**

Manages a single WebSocket connection and handles different message types.

```typescript
// Create a single WebSocket connection to the base URL
const socket = new WebSocket('ws://localhost:3000/ws');

// Handle the WebSocket connection open event
socket.onopen = () => {
    console.log('WebSocket connection established.');
    
    // Example: Send a message to subscribe or interact with the server
    socket.send(JSON.stringify({
        type: 'user',
        id: '12345',
        data: {
            action: 'subscribe'
        }
    }));
};

// Handle incoming messages from the server
socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Received message from server:', message);
    
    if (message.type === 'user') {
        console.log('User update:', message.data);
    } else if (message.type === 'product') {
        console.log('Product update:', message.data);
    }
};

// Handle WebSocket connection close event
socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
};

// Handle WebSocket errors
socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};
```



# Cron Job Implementation User Manual

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


# GraphQL Integration with ElysiaJS

## Overview

This manual describes how to integrate GraphQL with an ElysiaJS application. It includes setting up GraphQL schema and resolvers, and integrating them with ElysiaJS.

## Folder Structure

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

## Installation

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







