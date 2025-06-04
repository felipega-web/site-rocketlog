import { RequestHandler } from "express";
import { AppError } from '@/utils/AppError';
import { AuthConfig } from '@/configs/auth';
import { prisma } from '@/database/prisma';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { z } from 'zod';

class SessionsController {
  public create: RequestHandler = async (req, res) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new AppError("Email or password incorrect", 401);
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError("Email or password incorrect", 401);
    }

    const { secret, expiresIn } = AuthConfig.jwt;

    const token = sign({ role: user.role ?? "customer" }, secret, {
      subject: user.id,
      expiresIn,
    });

    const { password: _, ...userWithoutPassword } = user;

    // Sem return aqui:
    res.status(200).json({ message: "Login successful", token, user: userWithoutPassword });
  }
}

export { SessionsController };
