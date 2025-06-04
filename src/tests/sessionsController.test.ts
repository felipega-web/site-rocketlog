import request from "supertest";
import { prisma } from "@/database/prisma";
import {app} from "@/app"; 

describe("SessionsController", () => {

    let user_id: string;
    
    afterAll(async () => {
        console.log("Cleaning up test data...");
        await prisma.user.delete({
            where: { id: user_id }
        });
    });

    it("should authenticate a user with valid credentials and return a token", async () => {

        const userResponse = await request(app).post("/users").send({
            name: "Auth Doe",
            email: "auth@mail-test.com",
            password: "password123456"
        })

        user_id = userResponse.body.id;

        const sessionResponse = await request(app).post("/sessions").send({
            email: "auth@mail-test.com",
            password: "password123456"
        });

        expect(sessionResponse.status).toBe(200);
        expect(sessionResponse.body).toHaveProperty("token");
        expect(sessionResponse.body.token).toEqual(expect.any(String));
    });
});