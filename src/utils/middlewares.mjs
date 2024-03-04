import { mockUsers } from "./constants.mjs";


export const resolveIndexByUserId = (request, response, next) => {
    const {
      params: { id },
    } = request;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return response.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if  (findUserIndex < 0) return response.status(404).json({ message: "User not found" });
    request.findUserIndex = findUserIndex;
    next();
  }
  