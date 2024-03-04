import { Router } from 'express';
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from 'express-validator';
import { mockUsers } from '../utils/constants.mjs';
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';
import { resolveIndexByUserId } from '../utils/middlewares.mjs';
import { User } from '../mongoose/schemas/user.mjs';
import { hashPassword } from '../utils/helpers.mjs';
import { getUserByIdHandler, createUserHandler } from '../handlers/users.mjs';

const router = Router();

router.get(
  '/api/users',
  query('filter')
    .isString()
    .notEmpty()
    .withMessage('Must not be empty')
    .isLength({ min: 3, max: 10 })
    .withMessage('Must be atleast 3-10 characters'),
  (request, response) => {
    // console.log(request.session);
    console.log(request.session.id);
    request.sessionStore.get(request.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('Inside Session Store get');
      console.log(sessionData);
    });
    const result = validationResult(request);
    console.log(result);
    const {
      query: { filter, value },
    } = request;

    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
      );
    return response.send(mockUsers);
  }
);

router.get('/api/users/:id', resolveIndexByUserId, getUserByIdHandler);

router.post(
  '/api/users',
  checkSchema(createUserValidationSchema),
  createUserHandler
);

// PUT Request, updated the entire resource
router.put('/api/users/:id', resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});
// Patch
router.patch('/api/users/:id', resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

//delete
router.delete('/api/users/:id', resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
