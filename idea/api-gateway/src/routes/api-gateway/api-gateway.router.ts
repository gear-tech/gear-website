import { Request, Response, Router } from 'express';

import { apiGatewayService } from '../../services/api-gateway.service';
import { apiGatewayLogger } from '../../common/api-gateway.logger';
import { testBalanceMiddleware } from '../../middleware';
import { checkGenesisMiddleware } from '../../middleware/check-genesis.middleware';

export const apiGatewayRouter = Router({});

apiGatewayRouter.post('', testBalanceMiddleware, checkGenesisMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await apiGatewayService.rpc(req.body);
    res.json(result);
  } catch (err) {
    console.log(req.body);

    apiGatewayLogger.error(`ApiGatewayRouter: ${err}`);
    console.log(err);
  }
});
