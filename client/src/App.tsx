import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Item {
  id: number;
  name: string;
  quantity: number;
  price: number;
  createdAt?: string;
}

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api/items';

  const fetchItems = async () => {
    try {
      const response = await axios.get<Item[]>(API_URL);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handler for Quantity: Digits only (0-9)
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      setQuantity(val);
    }
  };

  // Handler for Price: Numbers and at most one decimal point
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setPrice(val);
    }
  };

  // Block keypresses like 'e', 'E', '+', '-' from being typed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    setLoading(true);
    try {
      await axios.post(API_URL, {
        name,
        quantity: quantity ? parseInt(quantity, 10) : 0,
        price: parseFloat(price),
      });

      setName('');
      setQuantity('');
      setPrice('');
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '896px' }}>
        
        {/* Header */}
        <header className="mb-8 border-b border-slate-700 pb-4 text-center md:text-left">
          <h1 className="text-3xl font-bold text-indigo-400">📦 Inventory Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">
            PERN Stack: PostgreSQL + Express + React + Node
          </p>
        </header>

        {/* Add Item Form */}
        <section className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">
            Add New Inventory Item
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Item Name (e.g., Mouse)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 text-white"
              required
            />
            
            {/* Quantity Input */}
            <input
              type="text"
              inputMode="numeric"
              placeholder="Quantity"
              value={quantity}
              onChange={handleQuantityChange}
              onKeyDown={handleKeyDown}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 text-white"
            />
            
            {/* Price Input */}
            <input
              type="text"
              inputMode="decimal"
              placeholder="Price ($)"
              value={price}
              onChange={handlePriceChange}
              onKeyDown={handleKeyDown}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 text-white"
              required
            />
            
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 text-white"
            >
              {loading ? 'Adding...' : '+ Add Item'}
            </button>
          </form>
        </section>

        {/* Current Stock Section */}
        <section className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          
          {/* Card Header */}
          <div className="p-6 border-b border-slate-700 text-center" style={{ width: '100%' }}>
            <h2 className="text-xl font-semibold text-slate-200">
              Current Stock ({items.length})
            </h2>
          </div>

          {/* Card Body */}
          <div className="p-4 md:p-6" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {items.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No items found. Add one above!
              </div>
            ) : (
              <div style={{ width: '100%', maxWidth: '700px', overflowX: 'auto' }}>
                <table 
                  className="bg-slate-900/40"
                  style={{ 
                    width: '100%', 
                    margin: '0 auto', 
                    borderCollapse: 'collapse', 
                    border: '1px solid #334155' 
                  }}
                >
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                      <th style={{ border: '1px solid #334155', padding: '12px' }} className="text-center">ID</th>
                      <th style={{ border: '1px solid #334155', padding: '12px' }} className="text-center">Item Name</th>
                      <th style={{ border: '1px solid #334155', padding: '12px' }} className="text-center">Quantity</th>
                      <th style={{ border: '1px solid #334155', padding: '12px' }} className="text-center">Price</th>
                      <th style={{ border: '1px solid #334155', padding: '12px' }} className="text-center">Total Value</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300 text-sm">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                        <td style={{ border: '1px solid #334155', padding: '12px' }} className="font-mono text-xs text-indigo-400 text-center">
                          #{item.id}
                        </td>
                        <td style={{ border: '1px solid #334155', padding: '12px' }} className="font-medium text-white text-center">
                          {item.name}
                        </td>
                        <td style={{ border: '1px solid #334155', padding: '12px' }} className="text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                              item.quantity > 5
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                                : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                            }`}
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            {item.quantity} in stock
                          </span>
                        </td>
                        <td style={{ border: '1px solid #334155', padding: '12px' }} className="text-center">
                          ${Number(item.price).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #334155', padding: '12px' }} className="font-semibold text-white text-center">
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </section>

      </div>
    </div>
  );
}