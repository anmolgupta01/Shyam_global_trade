const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get all products
const getProducts = asyncHandler(async (req, res) => {
  const {
    search = '',
    category = '',
    page = 1,
    limit = 12,
    sortOrder = 'desc'
  } = req.query;

  let query = {};

  if (category && category !== 'All') {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNumber - 1) * pageSize;

    const sortOptions = { createdAt: sortOrder === 'desc' ? -1 : 1 };

    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .sort(sortOptions)
        .limit(pageSize)
        .skip(skip)
        .select('name code description category image cloudinary_id createdAt updatedAt')
        .lean(),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalProducts / pageSize);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalProducts,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
          limit: pageSize
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

// Get product by ID
const getProductById = asyncHandler(async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
});

// Create product with Cloudinary upload
const createProduct = asyncHandler(async (req, res) => {
  try {
 
    const { name, code, description, category } = req.body;

    // Validate required fields
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Name and code are required'
      });
    }

    // Convert code to string and validate it's not empty after trimming
    const trimmedCode = String(code).trim();
    if (!trimmedCode) {
      return res.status(400).json({
        success: false,
        message: 'Product code cannot be empty or only whitespace'
      });
    }

    let imageUrl = '';
    let cloudinaryId = '';

    // Handle image upload to Cloudinary
    if (req.file) {
      try {
    
        // Validate file type
        if (!req.file.mimetype.startsWith('image/')) {
          return res.status(400).json({
            success: false,
            message: 'Only image files are allowed'
          });
        }

        // Validate file size (5MB limit)
        if (req.file.size > 5 * 1024 * 1024) {
          return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum 5MB allowed'
          });
        }

        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'products',
              resource_type: 'image',
              transformation: [
                { width: 800, height: 600, crop: 'limit' },
                { quality: 'auto:good' }
              ]
            },
            (error, result) => {
              if (error) {
                console.error('❌ Cloudinary error:', error);
                reject(error);
              } else {
             
                resolve(result);
              }
            }
          ).end(req.file.buffer);
        });

        imageUrl = result.secure_url;
        cloudinaryId = result.public_id;
        
    
      } catch (uploadError) {
        console.error('❌ Cloudinary upload failed:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Image upload failed: ' + uploadError.message
        });
      }
    }

    // Create product
    const productData = {
      name: name.trim(),
      code: trimmedCode.toUpperCase(),
      category: category ? category.trim() : '',
      description: description ? description.trim() : '',
      image: imageUrl,
      cloudinary_id: cloudinaryId
    };


    const product = await Product.create(productData);
    
   
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });

  } catch (error) {
    console.error('💥 Error creating product:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product code already exists'
      });
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + validationErrors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// Update product
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { name, code, description, category } = req.body;

    // Validate ObjectId format
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // If code is being updated, check for duplicates
    if (code && code.trim().toUpperCase() !== product.code) {
      const existingProduct = await Product.findOne({ 
        code: code.trim().toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Product code already exists'
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (code !== undefined) updateData.code = code.trim().toUpperCase();
    if (description !== undefined) updateData.description = description.trim();
    if (category !== undefined) updateData.category = category.trim();

    // Handle image update
    if (req.file) {
      try {
        // Validate file type
        if (!req.file.mimetype.startsWith('image/')) {
          return res.status(400).json({
            success: false,
            message: 'Only image files are allowed'
          });
        }

        // Validate file size (5MB limit)
        if (req.file.size > 5 * 1024 * 1024) {
          return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum 5MB allowed'
          });
        }

        // Delete old image from Cloudinary if exists
        if (product.cloudinary_id) {
          try {
            await cloudinary.uploader.destroy(product.cloudinary_id);
          } catch (deleteError) {
            console.error('Warning: Failed to delete old image from Cloudinary:', deleteError.message);
          }
        }

        // Upload new image
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'products',
              resource_type: 'image',
              transformation: [
                { width: 800, height: 600, crop: 'limit' },
                { quality: 'auto:good' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(req.file.buffer);
        });

        updateData.image = result.secure_url;
        updateData.cloudinary_id = result.public_id;
      } catch (uploadError) {
        console.error('❌ Image upload failed:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Image upload failed: ' + uploadError.message
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, lean: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product code already exists'
      });
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + validationErrors.join(', ')
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error updating product'
    });
  }
});

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete image from Cloudinary if exists
    if (product.cloudinary_id) {
      try {
        await cloudinary.uploader.destroy(product.cloudinary_id);
   
      } catch (cloudinaryError) {
        console.error('⚠️ Failed to delete image from Cloudinary:', cloudinaryError.message);
        // Don't fail the request if Cloudinary deletion fails
      }
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
});

// Get categories
const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    
    // Filter out empty categories and sort
    const validCategories = categories
      .filter(cat => cat && cat.trim().length > 0)
      .sort();
    
    res.json({
      success: true,
      data: {
        categories: [ 'All',...validCategories]
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};
