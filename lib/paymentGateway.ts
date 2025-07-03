
export const sendPaymentGatewayRequest = async (amount: number, currency: string) => {
    // Make an API call to the payment gateway (like Paystack, Stripe, etc.)
    // Here we mock the response
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true }); // Simulating successful payment
      }, 2000);
    });
  };
  