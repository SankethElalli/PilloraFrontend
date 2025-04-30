import React from 'react';
import Modal from './Modal';
import '../styles/CategoryModal.css';

const categories = [
  { id: 'personal-care', name: 'Personal Care', icon: 'bi-person-hearts' },
  { id: 'women-care', name: 'Women Care', icon: 'bi-gender-female' },
  { id: 'baby-care', name: 'Baby Care', icon: 'bi-balloon-heart' },
  { id: 'diabetes-care', name: 'Diabetes Care', icon: 'bi-droplet-half' },
  { id: 'cardiac-care', name: 'Cardiac Care', icon: 'bi-heart-pulse' },
  { id: 'stomach-care', name: 'Stomach Care', icon: 'bi-shield-plus' },
  { id: 'pain-relief', name: 'Pain Relief', icon: 'bi-bandaid' },
  { id: 'liver-care', name: 'Liver Care', icon: 'bi-shield-check' },
  { id: 'oral-care', name: 'Oral Care', icon: 'bi-emoji-smile' },
  { id: 'respiratory', name: 'Respiratory', icon: 'bi-lungs' },
  { id: 'sexual-health', name: 'Sexual Health', icon: 'bi-heart' },
  { id: 'elderly-care', name: 'Elderly Care', icon: 'bi-hospital' },
  { id: 'cold-immunity', name: 'Cold & Immunity', icon: 'bi-shield' },
  { id: 'ayurveda', name: 'Ayurveda', icon: 'bi-flower1' },
  { id: 'health-devices', name: 'Health Devices', icon: 'bi-thermometer' }
];

function CategoryFilterModal({ isOpen, onClose, selectedCategory, onSelectCategory }) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span>Select Category</span>
          {selectedCategory && (
            <span 
              className="clear-filter"
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory('');
                onClose();
              }}
            >
              Clear Filter
            </span>
          )}
        </div>
      }
    >
      <div className="category-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
            onClick={() => {
              onSelectCategory(category.name);
              onClose();
            }}
          >
            <i className={`bi ${category.icon} category-icon`}></i>
            <div className="category-name">{category.name}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default CategoryFilterModal;
