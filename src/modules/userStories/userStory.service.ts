import { Elysia } from 'elysia';

const userStoryService = new Elysia();

userStoryService.decorate('getUserStory', () => {
  return ['Product1', 'Product2', 'Product3'];
});

userStoryService.decorate('getUserStoryById', (id) => {
  return { id, name: `Product${id}` };
});

userStoryService.decorate('updateUserStoryById', (id) => {
    return { id, name: `Product${id}` };
});

userStoryService.decorate('deleteUserStoryById', (id) => {
    return { id, name: `Product${id}` };
});

userStoryService.decorate('createUserStory', (id) => {
    return { id, name: `Product${id}` };
});

export default userStoryService;