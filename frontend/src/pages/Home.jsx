import React, { useState, useEffect } from 'react';
import API from '../services/api';
import RecipeCard from '../components/RecipeCard';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, [category]);

  const fetchRecipes = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      
      const response = await API.get('/recipes', { params });
      setRecipes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await API.get('/recipes', { params: { search } });
      setRecipes(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading recipes...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Discover Delicious Recipes</h1>
      
      <div style={styles.filters}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>Search</button>
        </form>

        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option value="">All Categories</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="dessert">Dessert</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      <div style={styles.grid}>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>

      {recipes.length === 0 && (
        <p style={styles.noRecipes}>No recipes found. Be the first to create one!</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 20px',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#7f8c8d',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: '#2c3e50',
    textAlign: 'center',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  searchForm: {
    display: 'flex',
    flex: 1,
    minWidth: '300px',
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px 0 0 4px',
    fontSize: '1rem',
  },
  searchButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  select: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  },
  noRecipes: {
    textAlign: 'center',
    padding: '3rem',
    color: '#7f8c8d',
    fontSize: '1.1rem',
  },
};

export default Home;