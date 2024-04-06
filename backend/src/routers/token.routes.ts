import express from 'express';
import TokenController from '../controllers/TokenController';

const tokenRouter = express.Router();

tokenRouter.get('/:tokenId', TokenController.getTokenById);
tokenRouter.get('/images/:tokenId', TokenController.getTokenImage);

export default tokenRouter;
