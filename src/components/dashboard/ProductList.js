import React, { useState, useEffect } from 'react';
import '../../styles/ProductGrid.css';

function ProductList({ products, onEdit, onDelete }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="product-cards">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <div className="product-header">
              <div className="product-image-container">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <span className="product-category">{product.category}</span>
                <div className="product-price">₹{product.price}</div>
              </div>
            </div>
            
            <div className="product-meta">
              <span className={`status-badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
              <div className="product-actions">
                <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(product)}>
                  <i className="bi bi-pencil"></i>
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(product._id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table product-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>
                <div className="product-cell">
                  <img src={product.image} alt={product.name} className="product-thumb" />
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-id">#{product._id.slice(-6)}</div>
                  </div>
                </div>
              </td>
              <td>{product.category}</td>
              <td className="price-cell">₹{product.price}</td>
              <td>
                <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="btn-icon" onClick={() => onEdit(product)} title="Edit">
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn-icon delete" onClick={() => onDelete(product._id)} title="Delete">
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
