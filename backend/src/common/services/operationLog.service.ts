import { prisma } from '../../database/prisma';
import { logger } from '../logger';

interface LogOperationParams {
  action: string;
  entity: string;
  entityId?: number;
  userId?: number;
  details?: Record<string, unknown>;
}

export async function logOperation(params: LogOperationParams): Promise<void> {
  try {
    await prisma.operationLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        userId: params.userId,
        details: params.details ? JSON.stringify(params.details) : null,
      },
    });
  } catch (error) {
    logger.warn('Failed to log operation', { params, error });
  }
}
