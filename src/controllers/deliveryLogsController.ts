import { Request, Response } from 'express';
import { AppError } from '@/utils/AppError';
import { prisma } from '@/database/prisma';
import { z } from 'zod';

class DeliveryLogsController {
  public async create(request: Request, response: Response): Promise<void> {
    const bodySchema = z.object({
      delivery_id: z.string().uuid(),
      description: z.string().min(1).max(255),
    });

    const { delivery_id, description } = bodySchema.parse(request.body);

    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
    });

    if (!delivery) {
      throw new AppError('Delivery not found', 404);
    }

    if (delivery.status === 'delivered') {
      throw new AppError('Cannot create a log for a delivery that has already been delivered');
    }

    if (delivery.status === 'processing') {
      throw new AppError('Cannot create a log for a delivery that is still processing, change the status to shipped');
    }

    await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery_id,
        description,
      },
    });

    response.status(201).json({
      message: 'Delivery log created successfully',
    });
  }

  public async show(request: Request, response: Response): Promise<void> {
    const paramsSchema = z.object({
      delivery_id: z.string().uuid(),
    });

    const { delivery_id } = paramsSchema.parse(request.params);

    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
      include: { user: true, logs: true },
    });

    if (!delivery) {
      response.status(404).json({
        message: 'Delivery not found',
      });
    }

    if (request.user?.role === 'customer' && request.user.id !== delivery?.userId) {
      throw new AppError('The user can only see their own deliveries', 403);
    }

    response.status(200).json(delivery);
  }
}

export { DeliveryLogsController };
