const Banner = require('../models/Banner');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary (put this in your app.js or config file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single banner
// @route   GET /api/banners/:id
// @access  Public
const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    
    res.json(banner);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: 'Banner image is required. Make sure to send the file with field name "image"',
        hint: 'Check that your FormData uses form.append("image", fileObject)'
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'banners', // Optional: organize images in folders
      resource_type: 'image'
    });

    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    // Create banner with Cloudinary URL and public_id
    const banner = new Banner({
      image: result.secure_url,
      cloudinary_id: result.public_id // Store this to delete later
    });
    
    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);

  } catch (error) {
    console.error('❌ Error creating banner:', error);
    
    // Clean up uploaded file if banner creation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Server error while creating banner',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      // Clean up uploaded file if banner doesn't exist
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Update only if a new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (banner.cloudinary_id) {
        await cloudinary.uploader.destroy(banner.cloudinary_id);
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'banners',
        resource_type: 'image'
      });

      // Clean up temporary file
      fs.unlinkSync(req.file.path);

      // Update banner with new image
      banner.image = result.secure_url;
      banner.cloudinary_id = result.public_id;
    }

    const updatedBanner = await banner.save();
    res.json(updatedBanner);

  } catch (error) {
    // Clean up uploaded file if update fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Banner not found' });
    }

    res.status(500).json({
      message: 'Server error while updating banner',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Delete image from Cloudinary
    if (banner.cloudinary_id) {
      await cloudinary.uploader.destroy(banner.cloudinary_id);
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted successfully' });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Banner not found' });
    }

    res.status(500).json({ message: 'Server error while deleting banner' });
  }
};

module.exports = {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner
};
