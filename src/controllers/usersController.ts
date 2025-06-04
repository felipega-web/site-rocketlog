import { AppError } from '@/utils/AppError';
import { RequestHandler } from 'express';
import { prisma } from '@/database/prisma';
import { hash } from 'bcrypt';
import { z } from 'zod';

class UsersController {
  public create: RequestHandler = async (req, res) => {
    const bodySchema = z.object({
      name: z.string().trim().min(3, "Name is required"),
      email: z.string().email("Invalid email format"),
      password: z.string().min(6, "Password must be at least 6 characters long")
    });

    const { name, email, password } = bodySchema.parse(req.body);

    const userWithSameEmail = await prisma.user.findFirst({
      where: { email }
    });

    if (userWithSameEmail) {
      throw new AppError("User already exists");
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const { password: _, ...userWithoutPassword } = user;

    // Não retorna nada, apenas responde
    res.status(201).json(userWithoutPassword);
  };
}

export { UsersController }; 
