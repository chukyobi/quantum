import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; 
import { sendPaymentGatewayRequest } from '@/lib/paymentGateway'; // A helper function to interact with the payment gateway

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userEmail, amount, currency } = req.body;

    if (!userEmail || !amount || !currency) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      // 1. Create a new transaction record in the database
      const transaction = await prisma.transaction.create({
        data: {
          userEmail, // Use userEmail as the foreign key to link the user
          transactionType: 'deposit',
          amount,
          currency,
          status: 'pending',
        },
      });

      // 2. Call the payment gateway to initiate the transaction (using a helper function)
      const paymentResponse = await sendPaymentGatewayRequest(amount, currency);

      // 3. If payment is successful, update the transaction status and user's wallet balance
      if (paymentResponse.success) {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'successful' },
        });

        await prisma.wallet.updateMany({
          where: {
            email: userEmail,  // Use userEmail to find the correct wallet for the user
            currency: currency,
          },
          data: {
            balance: {
              increment: amount, // Add the deposit amount to the wallet balance
            },
          },
        });

        return res.status(200).json({ message: 'Funds added successfully' });
      }

      // If payment fails, return error
      return res.status(500).json({ message: 'Payment failed' });
    } catch (error) {
      console.error('Error adding funds:', error);
      return res.status(500).json({ message: 'Error processing payment' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
