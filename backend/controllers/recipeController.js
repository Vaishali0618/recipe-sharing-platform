const Recipe = require('../models/Recipe');
const User = require('../models/User');

exports.createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, category, difficulty, prepTime, cookTime, servings, tags, dietary } = req.body;

    const parsedIngredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    const parsedInstructions = typeof instructions === 'string' ? JSON.parse(instructions) : instructions;
    const parsedTags = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [];
    const parsedDietary = dietary ? (typeof dietary === 'string' ? JSON.parse(dietary) : dietary) : [];

    const recipe = new Recipe({
      title,
      description,
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      category,
      difficulty,
      prepTime: parseInt(prepTime),
      cookTime: parseInt(cookTime),
      servings: parseInt(servings),
      tags: parsedTags,
      dietary: parsedDietary,
      author: req.userId,
      images: req.files ? req.files.map(file => file.path) : []
    });

    await recipe.save();
    await recipe.populate('author', 'username profilePicture');
    
    res.status(201).json({ 
      message: 'Recipe created successfully', 
      recipe 
    });
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const { category, difficulty, search, dietary, sortBy } = req.query;
    let query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (dietary) query.dietary = dietary;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'popular') {
      sortOption = { 'likes': -1 };
    } else if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const recipes = await Recipe.find(query)
      .populate('author', 'username profilePicture')
      .sort(sortOption);

    res.json(recipes);
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username profilePicture bio')
      .populate('likes', 'username')
      .populate('ratings.user', 'username');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to update this recipe' });
    }

    Object.assign(recipe, req.body);
    await recipe.save();
    await recipe.populate('author', 'username profilePicture');

    res.json({ message: 'Recipe updated successfully', recipe });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this recipe' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};

exports.likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const likeIndex = recipe.likes.indexOf(req.userId);

    if (likeIndex > -1) {
      recipe.likes.splice(likeIndex, 1);
    } else {
      recipe.likes.push(req.userId);
    }

    await recipe.save();
    res.json({ 
      message: 'Recipe like toggled', 
      likes: recipe.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    console.error('Like recipe error:', error);
    res.status(500).json({ message: 'Error liking recipe', error: error.message });
  }
};