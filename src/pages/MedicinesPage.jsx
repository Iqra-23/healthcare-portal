import React, { useState, useEffect } from 'react';
import { Search, Filter, Pill, AlertCircle, Plus, Trash2, Edit, X, Tag } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const MedicinesPage = ({ token, isAdmin }) => {
  const [medicines, setMedicines] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    usage: '',
    sideEffect: '',
    category: '',
    tags: ''
  });
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMedicines();
  }, [category, token]);

  const loadMedicines = async () => {
    setLoading(true);
    setError('');
    try {
      let endpoint;
      let headers = {
        'Content-Type': 'application/json'
      };

      if (isAdmin && token) {
        endpoint = '/medicine';
        headers.Authorization = `Bearer ${token}`;
      } else {
        endpoint = category 
          ? `/medicine/common?category=${encodeURIComponent(category)}`
          : '/medicine/common';
      }

      const response = await fetch(`${API_BASE}${endpoint}`, { headers });
      
      if (!response.ok) {
        throw new Error(`Failed to load medicines: ${response.status}`);
      }
      
      const data = await response.json();
      setMedicines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading medicines:', err);
      setError(err.message);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.usage || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const sideEffectArray = formData.sideEffect
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t);

      const payload = {
        title: formData.title,
        imageUrl: formData.imageUrl || undefined,
        usage: formData.usage,
        sideEffect: sideEffectArray,
        category: formData.category,
        tags: tagsArray
      };

      const url = editingMedicine
        ? `${API_BASE}/medicine/${editingMedicine._id}`
        : `${API_BASE}/medicine`;

      const method = editingMedicine ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save medicine');
      }

      await loadMedicines();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving medicine:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;

    try {
      const response = await fetch(`${API_BASE}/medicine/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete medicine');
      }

      await loadMedicines();
    } catch (err) {
      console.error('Error deleting medicine:', err);
      setError('Failed to delete medicine');
    }
  };

  const openEditModal = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      title: medicine.title || '',
      imageUrl: medicine.imageUrl || '',
      usage: medicine.usage || '',
      sideEffect: Array.isArray(medicine.sideEffect) ? medicine.sideEffect.join(', ') : '',
      category: medicine.category || '',
      tags: Array.isArray(medicine.tags) ? medicine.tags.join(', ') : ''
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingMedicine(null);
    setFormData({
      title: '',
      imageUrl: '',
      usage: '',
      sideEffect: '',
      category: '',
      tags: ''
    });
    setError('');
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Heart/BP', label: 'Heart/BP' },
    { value: 'Diabetes', label: 'Diabetes' },
    { value: 'First Aid & Wound Care', label: 'First Aid & Wound Care' },
    { value: 'Pain Relief', label: 'Pain Relief' },
    { value: 'Vitamins & Multivitamins', label: 'Vitamins & Multivitamins' },
    { value: 'Fever & Cough', label: 'Fever & Cough' },
    { value: 'Minerals & Supplements', label: 'Minerals & Supplements' },
    { value: 'Gastrointestinal', label: 'Gastrointestinal' },
  ];

  const filteredMedicines = medicines.filter(med =>
    (med.title && med.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (med.category && med.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex justify-between items-start gap-8">
            <div className="flex-1">
              <h1 className="text-5xl lg:text-6xl font-bold mb-4">Common Medicines</h1>
              <p className="text-xl text-green-100 max-w-2xl leading-relaxed">
                Discover comprehensive information about common medicines including their uses, dosages, and potential side effects
              </p>
            </div>
            {isAdmin && token && (
              <button
                onClick={openAddModal}
                className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 flex-shrink-0"
              >
                <Plus className="w-6 h-6" />
                Add Medicine
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search medicines by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-lg transition-all"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-green-600" />
            <span className="font-bold text-gray-900 text-lg">Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
                  category === cat.value
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg py-20 text-center">
            <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading medicines...</p>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg py-20 text-center">
            <div className="inline-block bg-green-100 rounded-full p-6 mb-4">
              <Pill className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No medicines found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try a different search term' : 'Try selecting a different category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMedicines.map((med) => (
              <div
                key={med._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100"
              >
                {/* Image Section */}
                {med.imageUrl ? (
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600">
                    <img
                      src={med.imageUrl}
                      alt={med.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="h-56 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <svg class="w-20 h-20 text-white opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </div>
                        `;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <span className="absolute top-4 left-4 px-4 py-1 bg-white/95 text-green-700 rounded-full text-sm font-bold shadow-lg">
                      {med.category}
                    </span>
                  </div>
                ) : (
                  <div className="h-56 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center relative">
                    <Pill className="w-20 h-20 text-white opacity-30" />
                    <span className="absolute top-4 left-4 px-4 py-1 bg-white/95 text-green-700 rounded-full text-sm font-bold shadow-lg">
                      {med.category}
                    </span>
                  </div>
                )}

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">{med.title}</h3>
                    {isAdmin && token && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => openEditModal(med)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(med._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Usage */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <p className="font-bold text-gray-900">Usage:</p>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3">{med.usage}</p>
                  </div>

                  {/* Side Effects */}
                  {Array.isArray(med.sideEffect) && med.sideEffect.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <p className="font-bold text-gray-900">Side Effects:</p>
                      </div>
                      <ul className="text-gray-600 text-sm space-y-1">
                        {med.sideEffect.slice(0, 3).map((effect, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{effect}</span>
                          </li>
                        ))}
                        {med.sideEffect.length > 3 && (
                          <li className="text-gray-500 italic">+{med.sideEffect.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {Array.isArray(med.tags) && med.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {med.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200"
                        >
                          {tag}
                        </span>
                      ))}
                      {med.tags.length > 2 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                          +{med.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="e.g., Paracetamol"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.slice(1).map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Usage <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.usage}
                  onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
                  placeholder="Describe the usage and indications..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Side Effects (comma-separated)
                </label>
                <textarea
                  value={formData.sideEffect}
                  onChange={(e) => setFormData({ ...formData, sideEffect: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
                  placeholder="Nausea, Headache, Dizziness"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="prescription, over-the-counter, analgesic"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicinesPage;