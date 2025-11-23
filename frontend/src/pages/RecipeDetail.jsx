import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await API.get(`/recipes/${id}`);
      setRecipe(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await API.post(`/recipes/${id}/like`);
      fetchRecipe();
    } catch (error) {
      console.error('Error liking recipe:', error);
      alert('Please login to like recipes');
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!recipe) return <div style={styles.loading}>Recipe not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{recipe.title}</h1>
        <p style={styles.author}>By {recipe.author?.username}</p>
      </div>

      {recipe.images && recipe.images.length > 0 && (
        <img
          src={`http://localhost:5000/${recipe.images[0]}`}
          alt={recipe.title}
          style={styles.image}
        />
      )}

      <div style={styles.meta}>
        <span style={styles.badge}>{recipe.category}</span>
        <span style={styles.badge}>{recipe.difficulty}</span>
        <span>⏱️ Prep: {recipe.prepTime} min</span>
        <span>🍳 Cook: {recipe.cookTime} min</span>
        <span>👥 Serves: {recipe.servings}</span>
      </div>

      <button onClick={handleLike} style={styles.likeButton}>
        ❤️ {recipe.likes?.length || 0} Likes
      </button>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Description</h2>
        <p style={styles.description}>{recipe.description}</p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Ingredients</h2>
        <ul style={styles.list}>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} style={styles.listItem}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Instructions</h2>
        <ol style={styles.list}>
          {recipe.instructions.map((instruction, index) => (
            <li key={index} style={styles.listItem}>{instruction}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 20px',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#7f8c8d',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
    color: '#2c3e50',
  },
  author: {
    color: '#7f8c8d',
    fontSize: '1rem',
  },
  image: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  meta: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    color: '#7f8c8d',
  },
  badge: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    textTransform: 'capitalize',
  },
  likeButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom: '2rem',
  },
  section: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    color: '#2c3e50',
  },
  description: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#555',
  },
  list: {
    paddingLeft: '1.5rem',
  },
  listItem: {
    marginBottom: '0.8rem',
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#555',
  },
};

export default RecipeDetail;