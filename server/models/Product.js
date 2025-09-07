const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String
  },
  description: {
    type: String
  },
  category: {
    type: String
  },
  image: {
    type: String // This will now store the Cloudinary URL
  },
  cloudinary_id: {
    type: String // Store Cloudinary public_id for deletion
  }
}, {
  timestamps: true
});

// Static method to get categories
productSchema.statics.getCategories = function() {
  return this.distinct('category');
};

// Static method for bulk operations
productSchema.statics.bulkCreateProducts = function(products) {
  return this.insertMany(products);
};

module.exports = mongoose.model('Product', productSchema);
