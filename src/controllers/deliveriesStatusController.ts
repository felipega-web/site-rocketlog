import { RequestHandler } from 'express';
import { prisma } from '@/database/prisma';
import { z } from 'zod';

class DeliveriesStatusController {
  public update: RequestHandler = async (request, response) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      status: z.enum(['processing', 'shipped', 'delivered']),
    });

    const { id } = paramsSchema.parse(request.params);
    const { status } = bodySchema.parse(request.body);

    await prisma.delivery.update({
      where: { id },
      data: { status },
    });

    await prisma.deliveryLog.create({
      data: {
        deliveryId: id,
        description: `Delivery status updated to ${status}`,
      }
    });

    response.status(200).json();
  };
}

export { DeliveriesStatusController };
