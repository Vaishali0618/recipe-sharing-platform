import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <div style={styles.card}>
      {recipe.images && recipe.images.length > 0 && (
        <img 
          src={`http://localhost:5000/${recipe.images[0]}`} 
          alt={recipe.title}
          style={styles.image}
        />
      )}
      <div style={styles.content}>
        <h3 style={styles.title}>{recipe.title}</h3>
        <p style={styles.description}>
          {recipe.description.substring(0, 100)}...
        </p>
        <div style={styles.meta}>
          <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
          <span>👤 {recipe.author?.username}</span>
          <span>❤️ {recipe.likes?.length || 0}</span>
        </div>
        <div style={styles.tags}>
          <span style={styles.tag}>{recipe.category}</span>
          <span style={styles.tag}>{recipe.difficulty}</span>
        </div>
        <Link to={`/recipe/${recipe._id}`} style={styles.button}>
          View Recipe
        </Link>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '1rem',
  },
  title: {
    fontSize: '1.3rem',
    marginBottom: '0.5rem',
    color: '#2c3e50',
  },
  description: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  meta: {
    display: 'flex',
    gap: '15px',
    fontSize: '0.85rem',
    color: '#95a5a6',
    marginBottom: '0.5rem',
  },
  tags: {
    display: 'flex',
    gap: '8px',
    marginBottom: '1rem',
  },
  tag: {
    backgroundColor: '#ecf0f1',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    textTransform: 'capitalize',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
};

export default RecipeCard;