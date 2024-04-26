const express = require('express');
const router = express.Router();
// const axios = require('axios');
// const crypto = require('crypto');
const PaymentDetails = require('../models/paystack')


router.post('/api/payment', async (req, res) => {
  try {
    const {
      name,
      email,
      transactionReferenceNum,
      address: { state, city, addressType },
      cart,
      totalAmount,
    } = req.body;

    console.log('paystack')
    const newTransaction = new PaymentDetails({
      name,
      email,
      transactionReferenceNum,
      address: { state, city, addressType },
      cart,
      totalAmount,
    });

    await newTransaction.save();

    res.status(200).json({ success: true, message: 'Transaction details saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


module.exports = router;
