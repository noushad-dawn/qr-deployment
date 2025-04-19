const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const {authenticate} = require('../middleware/auth'); // JWT middleware

router.post('/add', authenticate, async (req, res) => {
  try {
    const {
      category,
      productName,
      quantity,
      price,
      date,
      customerName,
      phoneNumber,
      address,
    } = req.body;

    const userId = req.user.userId; // Extracted from JWT token
    const clientId = req.user.clientId; // Extracted from JWT token
    
    const newProduct = new Product({
      clientId,
      category,
      productDetails: {
        productName,
        quantity,
        price,
        date
      },
      customerDetails: {
        customerName,
        phoneNumber,
        address
      },
      user: {
        userId
      }, 
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const products = await Product.find({ clientId: req.user.clientId }).populate('processStatus.userId', 'name email'); // Populate user details
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
  try {
    const product = await Product.findById(id).populate('user.userId', 'name email'); // Populate user details
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

//asign the new process and add user details of the process and also pass the currentStepIndex from the frontend
router.patch('/assign-process/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { processName, currentStepIndex } = req.body;
  const userId = req.user.userId; // Extracted from JWT token
  console.log(id)
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.processStatus.push({
      stepName: processName,
      userId,
      updatedAt: new Date(),
    });
    product.currentStepIndex = currentStepIndex;

    await product.save();
    res.status(200).json({ message: 'Process assigned successfully', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to assign process' });
  }
});

router.delete('/delete/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});


module.exports = router;
