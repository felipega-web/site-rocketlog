import { RequestHandler } from 'express';
import { prisma } from '@/database/prisma';
import { z } from 'zod';

class DeliveriesController {
  
  public create: RequestHandler = async (request, response) => {
    const bodySchema = z.object({
      user_id: z.string().uuid(),
      description: z.string().min(1, 'Description is required'),
    });

    const { user_id, description } = bodySchema.parse(request.body);

    await prisma.delivery.create({
      data: {
        userId: user_id,
        description,
      },
    });

    response.status(201).json({
      message: 'Delivery created successfully',
    });
  };

  public index: RequestHandler = async (request, response) => {
    const deliveries = await prisma.delivery.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    response.status(200).json(deliveries);
  };
}

export { DeliveriesController };
