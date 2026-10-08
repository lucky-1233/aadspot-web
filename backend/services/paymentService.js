const paymentService = {
  async createPaymentIntent(data) {
    return {
      provider: process.env.PAYMENT_PROVIDER || 'mock',
      status: 'pending',
      reference: `mock_${Date.now()}`,
      amount: data.amount,
      currency: 'RWF',
      notice: 'Mock payment only. No funds are collected.',
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
