import { Elysia } from "elysia";
import { connectToDatabase } from "./config/database";
import { swagger } from '@elysiajs/swagger'
import organizationService from "./modules/organisations/organisation.service";
import productService from "./modules/products/product.service";
import skillService from "./modules/skills/skill.service";
import userStoryService from "./modules/userStories/userStory.service";
import organizationController from "./modules/organisations/organisation.controller";
import logixlysia from 'logixlysia'
import { logger } from "@chneau/elysia-logger";
import { config } from "./config/logger";

connectToDatabase()

const app = new Elysia().use(logixlysia(config))

//controllers
app.use(organizationController())


app.use(swagger({
  path:'/docs'
}))





//Start Server
app.listen(3000,(server)=>{
  console.log("server is started on localhost:3000")
  console.log("server api docs available on localhost:3000/docs")
})

