import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import tokenRouter from './routers/token.routes';
import DePaymentCron from './services/DePaymentCron';
dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan('dev'));

DePaymentCron();
app.use('/token', tokenRouter);

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on ${process.env.HOST_URL}:${process.env.PORT}`,
  );
});
