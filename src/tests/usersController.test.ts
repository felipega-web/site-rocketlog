import request from "supertest";
import { prisma } from "@/database/prisma";
import { app } from "@/app";

describe("UsersController", () => {
    let user_id: string;
    console.log("UsersController tests are running...");

    afterAll(async () => {
        console.log("Cleaning up test data...");
        await prisma.user.delete({
            where: { id: user_id }
        });
    });

    it("should create a new user successfully", async () => {
        const response = await request(app).post("/users").send({
            name: "John Doe",
            email: "john@mail.com",
            password: "password123456"
        })

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe("John Doe");

        user_id = response.body.id;
    });

    it("should not create a user with an existing email", async () => {
        const response = await request(app).post("/users").send({
            name: "Jane Doe",
            email: "john@mail.com",
            password: "password123456"
        })

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("User already exists");
    });

    it("should not create a user with an invalid email", async () => {
        const response = await request(app).post("/users").send({
            name: "Jane Doe",
            email: "jane-mail",
            password: "password123456"
        })

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Validation error");
    });
});