import { Elysia } from "elysia";
import  { newOrgType } from "./dtos/organisation.input.dto";
import OrganizationModel from "./organisation.schema";

const organizationService = new Elysia()
  .decorate("getOrganization", async () => {
    return await OrganizationModel.find();
  })
  .decorate("getOrganizationById", async (id: string) => {
    try {
      let result = await OrganizationModel.findById(id);
      return result;
    } catch (error) {
      return null;
    }
  })
  .decorate("updateOrganizationById", (id: string) => {
    return { id, name: `Product${id}` };
  })
  .decorate("deleteOrganizationById", async (id: string) => {
    try {
      let result = await OrganizationModel.deleteOne({_id:id});
      return result;
    } catch (error) {
      return null;
    }
  })
  .decorate("createOrganization", async (org: newOrgType) => {
    return await OrganizationModel.create(org);
  });

export type organizationServiceType = typeof organizationService;

export default organizationService;
