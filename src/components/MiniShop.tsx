'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/Card';

// Mock product data
const initialProducts = [
  {
    id: '1',
    name: 'Premium Listing',
    description: 'Get featured at the top of search results for 30 days',
    price: 29.99,
    image: '/placeholder.jpg'
  },
  {
    id: '2',
    name: 'Business Spotlight',
    description: 'Featured on the homepage for 7 days',
    price: 19.99,
    image: '/placeholder.jpg'
  },
  {
    id: '3',
    name: 'Review Response Pack',
    description: '50 AI-generated review responses',
    price: 14.99,
    image: '/placeholder.jpg'
  }
];

export default function MiniShop() {
  const [products, setProducts] = useState(initialProducts);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.description || newProduct.price <= 0) return;
    
    const product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      image: '/placeholder.jpg'
    };
    
    setProducts([...products, product]);
    setNewProduct({ name: '', description: '', price: 0 });
    setIsAddingProduct(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-black">Mini Shop</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          className="text-red-600 border-red-600 hover:bg-red-50"
          onClick={() => setIsAddingProduct(!isAddingProduct)}
        >
          {isAddingProduct ? 'Cancel' : 'Add Product'}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-black mb-4">Sell products and services directly to your customers.</p>
        
        {isAddingProduct && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-black mb-4">Add New Product</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Price ($)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  value={newProduct.price || ''}
                  onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                  min="0"
                  step="0.01"
                />
              </div>
              <Button 
                variant="primary" 
                onClick={handleAddProduct}
              >
                Add Product
              </Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="relative h-40 bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-black">{product.name}</h3>
                  <span className="text-red-600 font-bold">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-black text-sm mb-3">{product.description}</p>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" className="text-black">Edit</Button>
                  <Button variant="primary" size="sm">Add to Cart</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-black mb-4">No products added yet.</p>
            <Button variant="primary" onClick={() => setIsAddingProduct(true)}>
              Add Your First Product
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
