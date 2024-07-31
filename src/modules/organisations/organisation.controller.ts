import Elysia from "elysia";
import organizationService from "./organisation.service";
import getByIdInputDto from "./dtos/organisation.input.dto";


const organizationController = () => {
  const app = new Elysia({ prefix: "organizations" })
    .use(organizationService)
    .use(getByIdInputDto)
    .get("/", async ({ getOrganization, set, store }) => {
      return await getOrganization();
    })
    .get("/:id", async ({ params, getOrganizationById, set }) => {
      const user = await getOrganizationById(params.id);

      if (!user) {
        set.status = 400;
        return {
          message: "Id not found",
        };
      }

      return user;
    })
    .post(
      "/create",
      async ({ body, createOrganization }) => {
        return await createOrganization(body);
      },
      {
        body: "newOrg",
      }
    )
    .post(
      "/delete",
      async ({ body, deleteOrganizationById, set }) => {
        let result = await deleteOrganizationById(body.id);
        if (!result) {
          set.status = 400;
          return "Id not found";
        }

        return {
          message: "Record Deleted",
          data: result,
        };
      },
      {
        body: "byId",
      }
    );

  return app;
};

export default organizationController;
