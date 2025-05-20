import React, { useEffect, useState } from 'react';

function ProductForm({ onSubmit, onCancel, product }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    adBanner: '',
    showInBanner: false
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || '',
        image: product.image || '',
        adBanner: product.adBanner || '',
        showInBanner: product.showInBanner || false
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product && product._id) {
      onSubmit({ ...formData, _id: product._id });
    } else {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label className="form-label">Product Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="Enter product name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          placeholder="Enter product description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            placeholder="0.00"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Stock</label>
          <input
            type="number"
            name="stock"
            className="form-control"
            placeholder="0"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Category</label>
        <select
          name="category"
          className="form-select"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          <option value="Personal Care">Personal Care</option>
          <option value="Women Care">Women Care</option>
          <option value="Baby Care">Baby Care</option>
          <option value="Diabetes Care">Diabetes Care</option>
          <option value="Cardiac Care">Cardiac Care</option>
          <option value="Stomach Care">Stomach Care</option>
          <option value="Pain Relief">Pain Relief</option>
          <option value="Liver Care">Liver Care</option>
          <option value="Oral Care">Oral Care</option>
          <option value="Respiratory">Respiratory</option>
          <option value="Sexual Health">Sexual Health</option>
          <option value="Elderly Care">Elderly Care</option>
          <option value="Cold & Immunity">Cold & Immunity</option>
          <option value="Ayurveda">Ayurveda</option>
          <option value="Health Devices">Health Devices</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Image URL</label>
        <input
          type="url"
          name="image"
          className="form-control"
          placeholder="https://"
          value={formData.image}
          onChange={handleChange}
          required
        />
      </div>

      <div className="ad-banner-section mt-4">
        <h5 className="section-title">Promotional Banner (Optional)</h5>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="showInBanner"
            name="showInBanner"
            checked={formData.showInBanner}
            onChange={(e) => setFormData({
              ...formData,
              showInBanner: e.target.checked
            })}
          />
          <label className="form-check-label" htmlFor="showInBanner">
            Show this product in homepage banner
          </label>
        </div>

        {formData.showInBanner && (
          <div className="form-group">
            <label className="form-label">Banner Image URL</label>
            <input
              type="url"
              name="adBanner"
              className="form-control"
              placeholder="https:// (Recommended size: 1200x400px)"
              value={formData.adBanner}
              onChange={handleChange}
            />
            <small className="text-muted">
              For best results, use a high-resolution image with dimensions 1200x400 pixels
            </small>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Product
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
