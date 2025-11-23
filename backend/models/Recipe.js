const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  ingredients: [{ 
    type: String, 
    required: true 
  }],
  instructions: [{ 
    type: String, 
    required: true 
  }],
  images: [{ 
    type: String 
  }],
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'appetizer'], 
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    required: true 
  },
  prepTime: { 
    type: Number, 
    required: true 
  },
  cookTime: { 
    type: Number, 
    required: true 
  },
  servings: { 
    type: Number, 
    required: true 
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  ratings: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    rating: { 
      type: Number, 
      min: 1, 
      max: 5 
    }
  }],
  tags: [{ 
    type: String 
  }],
  dietary: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo']
  }]
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);