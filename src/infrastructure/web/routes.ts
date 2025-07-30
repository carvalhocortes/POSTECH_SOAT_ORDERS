import express from 'express';
import customerRoutes from '@infrastructure/web/routes/customer.routes';
import productRoutes from '@infrastructure/web/routes/product.routes';
import orderRoutes from '@infrastructure/web/routes/order.routes';

const router = express.Router();

// Health check
router.get('/api/health', async (req, res) => {
  res.status(200).json({
    status: 'OK',
  });
});

// Main routes
router.use('/api/customers', customerRoutes);
router.use('/api/products', productRoutes);
router.use('/api/orders', orderRoutes);

export default router;
