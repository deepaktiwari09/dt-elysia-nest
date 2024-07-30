import { Elysia, t, Static } from "elysia";

let newOrg = t.Object({
  description: t.String(),
  jobs: t.Array(
    t.Object({
      current: t.Boolean(),
      endDate: t.String(),
      position: t.String(),
      responsibility: t.String(),
      startDate: t.String(),
    }),{
        minItems:0
    }
  ),
  location: t.String(),
  name: t.String(),
  products: t.Array(t.String()),
  size: t.Integer(),
  website: t.String(),
});

const getByIdInputDto = new Elysia().model({
  byId: t.Object({
    id: t.String(),
  }),
  paramId: t.String(),
  newOrg,
});

export type newOrgType = Static<typeof newOrg>;
export default getByIdInputDto;
