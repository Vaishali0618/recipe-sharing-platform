import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function CreateRecipe() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    category: 'breakfast',
    difficulty: 'easy',
    prepTime: '',
    cookTime: '',
    servings: '',
  });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      images.forEach(image => {
        data.append('images', image);
      });

      await API.post('/recipes', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Failed to create recipe');
    }
  };

  const addIngredient = () => {
    setFormData({...formData, ingredients: [...formData.ingredients, '']});
  };

  const addInstruction = () => {
    setFormData({...formData, instructions: [...formData.instructions, '']});
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({...formData, ingredients: newIngredients});
  };

  const updateInstruction = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({...formData, instructions: newInstructions});
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create New Recipe</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
  <label style={styles.label}>Instructions</label>
  {formData.instructions.map((inst, index) => (
    <div key={index} style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
      <textarea
        value={inst}
        onChange={(e) => updateInstruction(index, e.target.value)}
        style={{...styles.input, minHeight: '60px', flex: 1}}
        placeholder={`Step ${index + 1}`}
        required
      />
      {formData.instructions.length > 1 && (
        <button 
          type="button" 
          onClick={() => {
            const newInstructions = formData.instructions.filter((_, i) => i !== index);
            setFormData({...formData, instructions: newInstructions});
          }}
          style={{...styles.addButton, backgroundColor: '#e74c3c', padding: '8px 12px'}}
        >
          ✕
        </button>
      )}
    </div>
  ))}
  <button type="button" onClick={addInstruction} style={styles.addButton}>
    + Add Step
  </button>
</div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Ingredients</label>
          {formData.ingredients.map((ing, index) => (
            <input
              key={index}
              type="text"
              value={ing}
              onChange={(e) => updateIngredient(index, e.target.value)}
              style={{...styles.input, marginBottom: '8px'}}
              placeholder={`Ingredient ${index + 1}`}
              required
            />
          ))}
          <button type="button" onClick={addIngredient} style={styles.addButton}>
            + Add Ingredient
          </button>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Instructions</label>
          {formData.instructions.map((inst, index) => (
            <textarea
              key={index}
              value={inst}
              onChange={(e) => updateInstruction(index, e.target.value)}
              style={{...styles.input, minHeight: '60px', marginBottom: '8px'}}
              placeholder={`Step ${index + 1}`}
              required
            />
          ))}
          <button type="button" onClick={addInstruction} style={styles.addButton}>
            + Add Step
          </button>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={styles.input}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="dessert">Dessert</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              style={styles.input}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Prep Time (minutes)</label>
            <input
              type="number"
              value={formData.prepTime}
              onChange={(e) => setFormData({...formData, prepTime: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Cook Time (minutes)</label>
            <input
              type="number"
              value={formData.cookTime}
              onChange={(e) => setFormData({...formData, cookTime: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Servings</label>
            <input
              type="number"
              value={formData.servings}
              onChange={(e) => setFormData({...formData, servings: e.target.value})}
              style={styles.input}
              required
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.submitButton}>Create Recipe</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#2c3e50',
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#2c3e50',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  addButton: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
};

export default CreateRecipe;