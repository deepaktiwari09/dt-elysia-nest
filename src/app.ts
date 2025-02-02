import { Elysia } from "elysia";
import { connectToDatabase } from "./config/database";
import { swagger } from "@elysiajs/swagger";
import organizationController from "./modules/organisations/organisation.controller";
import logixlysia from "logixlysia";
import { config } from "./config/logger";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from '@elysiajs/static'

connectToDatabase();

const app = new Elysia()
  .use(cors())
  .use(staticPlugin())
  .use(logixlysia(config))
  .use(organizationController())
  .use(swagger({ path: "/docs" }))
  .listen(3000, (server) => {
    console.log("server is started on localhost:3000");
    console.log("server api docs available on localhost:3000/docs");
  });
