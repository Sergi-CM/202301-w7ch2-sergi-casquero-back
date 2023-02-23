import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "..";
import connectDataBase from "../../database/connectDataBase";
import { type UserCredentials } from "../../types";
import User from "../../database/models/User";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDataBase(server.getUri());
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

describe("Given a POST users/register ", () => {
  describe("When it receives a request with name lluis and password 12345678", () => {
    describe("And the userName and the password don't exist in the database", () => {
      test("Then it should return status", async () => {
        const newUser: UserCredentials = {
          username: "lluis",
          password: "12345678",
          avatar: "prueba",
          email: "osfj",
        };
        await User.create(newUser);
        const mockUser: UserCredentials = newUser;
        const status = 200;
        const response = await request(app)
          .post("/users/register")
          .send(mockUser)
          .expect(status);
        expect(response.body).toHaveBeenCalledWith(status);
      });
    });
  });
});
