import express from 'express';
import controller from '../controllers/expressCheckoutController.js';

const app = express();

app.post('/my-api/create-payment/', controller.createPayment);

app.post('/my-api/execute-payment/', controller.executePayment);

export {app as expressCheckoutRouter};