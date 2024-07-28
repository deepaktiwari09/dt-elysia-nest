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

###Running the Application

Start the Application: Use the following command to run your application.

```bash
bun src/app.js
```

**Access Swagger Documentation**: Open your browser and navigate to http://localhost:3000/docs to view the API documentation.
