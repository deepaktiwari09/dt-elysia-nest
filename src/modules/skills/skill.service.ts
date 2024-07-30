import { Elysia } from 'elysia';

const skillService = new Elysia();

skillService.decorate('getSkill', () => {
  return ['Product1', 'Product2', 'Product3'];
});

skillService.decorate('getSkillById', (id) => {
  return { id, name: `Product${id}` };
});

skillService.decorate('updateSkillById', (id) => {
    return { id, name: `Product${id}` };
});

skillService.decorate('deleteSkillById', (id) => {
    return { id, name: `Product${id}` };
});

skillService.decorate('createSkill', (id) => {
    return { id, name: `Product${id}` };
});

export default skillService;