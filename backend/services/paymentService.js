const paymentService = {
  async createPaymentIntent(data) {
    return {
      provider: process.env.PAYMENT_PROVIDER || 'mock',
      status: 'pending',
      reference: `mock_${Date.now()}`,
      amount: data.amount,
      currency: 'RWF',
    };
  },

  async verifyPayment(reference) {
    return {
      reference,
      status: 'paid',
      verified: true,
    };
  },
};

module.exports = paymentService;
