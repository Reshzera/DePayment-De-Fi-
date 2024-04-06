import { Request, Response } from 'express';
import DePaymentTokenRepository from '../repository/DePaymentTokenRepository';

class TokenController {
  async getTokenById(req: Request, res: Response) {
    const { tokenId } = req.params;
    const formatedTokenId = tokenId.replace('.json', '');

    if (!formatedTokenId.match(/^[0-9]+$/)) {
      return res.status(400).json({ error: 'Invalid token ID' });
    }

    const bigintTokenId = BigInt(formatedTokenId);

    try {
      await DePaymentTokenRepository.ownerOf(bigintTokenId);
    } catch (error) {
      return res.status(404).json({ error: 'Token not found' });
    }

    return res.json({
      name: `Access #${formatedTokenId}`,
      description: `Your access token to the system`,
      image: `${process.env.HOST_URL}:${process.env.PORT}/token/images/${tokenId}`,
    });
  }
  async getTokenImage(req: Request, res: Response) {
    const { tokenId } = req.params;
    const formatedTokenId = tokenId.replace('.json', '');

    if (!formatedTokenId.match(/^[0-9]+$/)) {
      return res.status(400).json({ error: 'Invalid token ID' });
    }
    const bigintTokenId = BigInt(formatedTokenId);

    try {
      await DePaymentTokenRepository.ownerOf(bigintTokenId);
    } catch (error) {
      return res.status(404).json({ error: 'Token not found' });
    }
    return res.download(`${__dirname}/../../assets/ticket.jpg`);
  }
}

export default new TokenController();
