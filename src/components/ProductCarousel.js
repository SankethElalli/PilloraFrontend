import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api';
import '../styles/ProductCarousel.css';

function ProductCarousel() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products?limit=10`);
        console.log('Fetched products:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  if (products.length === 0) {
    return <div>Loading products...</div>;
  }

  return (
    <section className="product-carousel-section py-5">
      <div className="container">
        <h2 className="text-center mb-5">Featured Products</h2>
        <div className="product-carousel">
          <div className="product-track">
            {[...products, ...products].map((product, index) => (
              <Link 
                to="/products" 
                key={`${product._id}-${index}`}
                className="carousel-product-card"
              >
                <div className="carousel-product-image">
                  <img 
                    src={product.image.startsWith('http') 
                      ? product.image 
                      : `${API_BASE_URL}${product.image}`}
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-product.png';
                    }}
                  />
                </div>
                <h4>{product.name}</h4>
                <p className="price">₹{product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductCarousel;
