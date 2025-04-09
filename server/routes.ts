import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  addToCartSchema, 
  updateCartItemSchema, 
  checkoutSchema,
  type Product
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import fetch from "node-fetch";

async function fetchProductsFromAPI() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    const products = await response.json();
    
    // Store products in memory
    for (const product of products) {
      await storage.createProduct({
        title: product.title,
        price: product.price.toString(),
        description: product.description,
        category: product.category,
        image: product.image,
        rating: product.rating
      });
    }
    
    console.log('Successfully loaded products from Fake Store API');
  } catch (error) {
    console.error('Error fetching products from API:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize API with products
  await fetchProductsFromAPI();
  
  // Create router for API endpoints
  const apiRouter = express.Router();
  
  // Get all products
  apiRouter.get('/products', async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving products' });
    }
  });
  
  // Get product by ID
  apiRouter.get('/products/:id', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
      
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving product' });
    }
  });
  
  // Get products by category
  apiRouter.get('/products/category/:category', async (req, res) => {
    try {
      const category = req.params.category;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving products by category' });
    }
  });
  
  // Get all categories
  apiRouter.get('/categories', async (_req, res) => {
    try {
      const products = await storage.getProducts();
      const categories = [...new Set(products.map(product => product.category))];
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving categories' });
    }
  });
  
  // Get cart items for a user
  apiRouter.get('/cart/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const cartItems = await storage.getCartItems(userId);
      
      // For each cart item, get the product details
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          return {
            id: item.id,
            product: product as Product,
            quantity: item.quantity
          };
        })
      );
      
      res.json(cartWithProducts);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving cart items' });
    }
  });
  
  // Add item to cart
  apiRouter.post('/cart/:userId/add', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const validatedData = addToCartSchema.parse(req.body);
      
      const product = await storage.getProductById(validatedData.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      const cartItem = await storage.addToCart({
        productId: validatedData.productId,
        quantity: validatedData.quantity,
        userId
      });
      
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Error adding item to cart' });
    }
  });
  
  // Update cart item quantity
  apiRouter.put('/cart/update/:id', async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid cart item ID' });
      }
      
      const validatedData = updateCartItemSchema.parse({ ...req.body, id: itemId });
      
      const updatedItem = await storage.updateCartItem(validatedData.id, validatedData.quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: 'Cart item not found or removed' });
      }
      
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Error updating cart item' });
    }
  });
  
  // Remove item from cart
  apiRouter.delete('/cart/remove/:id', async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid cart item ID' });
      }
      
      const success = await storage.removeCartItem(itemId);
      if (!success) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      
      res.json({ message: 'Item removed from cart' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing item from cart' });
    }
  });
  
  // Checkout
  apiRouter.post('/checkout/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      // Validate checkout form data
      const validatedData = checkoutSchema.parse(req.body);
      
      // Get cart items for the user
      const cartItems = await storage.getCartItems(userId);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
      
      // Calculate total amount
      let totalAmount = 0;
      for (const item of cartItems) {
        const product = await storage.getProductById(item.productId);
        if (product) {
          totalAmount += parseFloat(product.price.toString()) * item.quantity;
        }
      }
      
      // Add shipping cost if total is less than 1000 MXN
      if (totalAmount < 1000) {
        totalAmount += 99.99;
      }
      
      // Add tax (21%)
      totalAmount += totalAmount * 0.21;
      
      // Create order
      const order = await storage.createOrder({
        userId,
        orderDate: new Date().toISOString(),
        totalAmount: totalAmount.toString(),
        shippingAddress: `${validatedData.address}, ${validatedData.city}, ${validatedData.zip}`,
        paymentDetails: {
          name: validatedData.name,
          email: validatedData.email,
          cardNumber: validatedData.cardNumber,
          expiration: validatedData.expiration,
          cvv: validatedData.cvv
        },
        status: 'completed'
      });
      
      // Clear the user's cart
      await storage.clearCart(userId);
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Error processing checkout' });
    }
  });
  
  // Register API routes
  app.use('/api', apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
