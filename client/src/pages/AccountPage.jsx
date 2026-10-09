import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MapPin,
  Truck,
  LogOut,
  Save,
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export const AccountPage = () => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get('tab') || 'profile';

  const [orders, setOrders] = useState([]);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [savedMsg, setSavedMsg] = useState('');

  // Address modal/form state
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Odisha');
  const [newPincode, setNewPincode] = useState('');
  const [addressMsg, setAddressMsg] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.getMyOrders();
        if (res.success) setOrders(res.orders);
      } catch (err) {
        console.error(err);
      }
    };
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name: profileName, phone: profilePhone });
      setSavedMsg('Profile updated successfully!');
      setTimeout(() => setSavedMsg(''), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPincode) return;

    const existingAddresses = user?.addresses || [];
    const updated = [
      ...existingAddresses,
      {
        fullName: profileName || user?.name,
        phone: profilePhone || user?.phone || '9999999999',
        street: newStreet,
        city: newCity,
        state: newState,
        pincode: newPincode,
        isDefault: existingAddresses.length === 0
      }
    ];

    try {
      await updateProfile({ addresses: updated });
      setAddressMsg('New address added!');
      setNewStreet('');
      setNewCity('');
      setNewPincode('');
      setTimeout(() => setAddressMsg(''), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-spice-cream py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-1">
            Customer Dashboard
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown">
            My Account
          </h1>
          <p className="text-xs text-spice-brown/70 mt-0.5">
            Logged in as <strong className="text-spice-crimson">{user?.name}</strong> ({user?.email})
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Navigation Sidebar */}
          <aside className="md:col-span-4 bg-white rounded-3xl p-5 border border-spice-tan/60 shadow-sm self-start space-y-2">
            <button
              type="button"
              onClick={() => setSearchParams({ tab: 'profile' })}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
                activeTab === 'profile'
                  ? 'bg-spice-crimson text-white shadow-xs'
                  : 'text-spice-brown/80 hover:bg-spice-sand'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setSearchParams({ tab: 'orders' })}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
                activeTab === 'orders'
                  ? 'bg-spice-crimson text-white shadow-xs'
                  : 'text-spice-brown/80 hover:bg-spice-sand'
              }`}
            >
              <span className="flex items-center space-x-3">
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </span>
              <span className="bg-spice-sand/80 text-spice-brown text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSearchParams({ tab: 'wishlist' })}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
                activeTab === 'wishlist'
                  ? 'bg-spice-crimson text-white shadow-xs'
                  : 'text-spice-brown/80 hover:bg-spice-sand'
              }`}
            >
              <span className="flex items-center space-x-3">
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
              </span>
              <span className="bg-spice-sand/80 text-spice-brown text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {wishlistItems.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSearchParams({ tab: 'addresses' })}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
                activeTab === 'addresses'
                  ? 'bg-spice-crimson text-white shadow-xs'
                  : 'text-spice-brown/80 hover:bg-spice-sand'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>

            <Link
              to="/track-order"
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold text-spice-brown/80 hover:bg-spice-sand transition-colors block"
            >
              <Truck className="w-4 h-4 text-spice-crimson" />
              <span>Track Orders Live</span>
            </Link>

            <div className="pt-2 border-t border-spice-tan/40">
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Right Main Panel Content */}
          <main className="md:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-spice-tan/60 shadow-sm min-h-[400px]">
            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="font-serif font-bold text-lg text-spice-brown pb-2 border-b border-spice-tan/40">
                  Profile Details
                </h2>

                {savedMsg && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{savedMsg}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-spice-brown mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-spice-brown mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-gray-100 border border-spice-tan/40 rounded-xl px-3.5 py-2.5 text-xs text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-spice-brown mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-spice-crimson hover:bg-spice-deepRed text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-spice transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-serif font-bold text-lg text-spice-brown pb-2 border-b border-spice-tan/40">
                  My Orders History
                </h2>

                {orders.length === 0 ? (
                  <div className="text-center py-12 text-spice-brown/70 space-y-3">
                    <Package className="w-10 h-10 mx-auto text-spice-brown/30" />
                    <p className="text-xs sm:text-sm">You haven't placed any spice orders yet.</p>
                    <Link
                      to="/shop"
                      className="inline-block bg-spice-crimson text-white px-5 py-2 rounded-full text-xs font-bold"
                    >
                      Shop Fresh Spices
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord._id}
                        className="bg-spice-cream/60 rounded-2xl p-4 sm:p-5 border border-spice-tan/50 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-spice-tan/30 pb-2 gap-2">
                          <div>
                            <span className="font-mono font-bold text-xs sm:text-sm text-spice-crimson">
                              {ord.orderId}
                            </span>
                            <span className="text-[11px] text-spice-brown/60 ml-2">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-spice-sand border border-spice-tan text-spice-brown">
                              {ord.orderStatus}
                            </span>
                            <span className="font-serif font-bold text-sm text-spice-brown">
                              ₹{ord.total}
                            </span>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-2">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs text-spice-brown">
                              <span className="truncate">
                                {it.productName} ({it.size}) × {it.quantity}
                              </span>
                              <span className="font-semibold ml-2">₹{it.subtotal}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-1 flex items-center justify-between text-xs">
                          <span className="text-spice-brown/60">
                            Deliver to: {ord.shippingAddress.city}, {ord.shippingAddress.pincode}
                          </span>
                          <Link
                            to={`/track-order?orderId=${ord.orderId}`}
                            className="text-spice-crimson font-bold hover:underline flex items-center space-x-1"
                          >
                            <span>Live Track</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="font-serif font-bold text-lg text-spice-brown pb-2 border-b border-spice-tan/40">
                  My Wishlist ({wishlistItems.length})
                </h2>

                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12 text-spice-brown/70 space-y-3">
                    <Heart className="w-10 h-10 mx-auto text-spice-brown/30" />
                    <p className="text-xs sm:text-sm">Your wishlist is currently empty.</p>
                    <Link
                      to="/shop"
                      className="inline-block bg-spice-crimson text-white px-5 py-2 rounded-full text-xs font-bold"
                    >
                      Browse Spices
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.map((prod) => (
                      <div
                        key={prod._id}
                        className="bg-spice-cream rounded-2xl p-4 border border-spice-tan/50 flex space-x-3 items-center justify-between"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={prod.productImages?.[0] || '/images/products/turmeric.jpg'}
                            alt=""
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-spice-tan/40"
                          />
                          <div className="min-w-0">
                            <h4 className="font-serif font-bold text-xs sm:text-sm text-spice-brown truncate">
                              {prod.name}
                            </h4>
                            <p className="font-serif font-bold text-xs text-spice-crimson">
                              ₹{prod.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(prod, '100g', 1);
                              removeFromWishlist(prod._id);
                            }}
                            className="px-2.5 py-1 bg-spice-crimson text-white rounded-lg text-[10px] font-bold shadow-2xs hover:bg-spice-deepRed"
                          >
                            Move to Cart
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(prod._id)}
                            className="text-gray-400 hover:text-red-600 text-center py-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5 mx-auto" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <h2 className="font-serif font-bold text-lg text-spice-brown pb-2 border-b border-spice-tan/40">
                  Saved Delivery Addresses
                </h2>

                {addressMsg && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{addressMsg}</span>
                  </div>
                )}

                <div className="space-y-3">
                  {(user?.addresses || []).map((addr, i) => (
                    <div
                      key={i}
                      className="p-4 bg-spice-cream rounded-2xl border border-spice-tan/60 text-xs text-spice-brown space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <strong className="text-sm font-serif">{addr.fullName}</strong>
                        {addr.isDefault && (
                          <span className="bg-spice-sand text-spice-brown font-bold text-[10px] px-2 py-0.5 rounded-full border border-spice-tan">
                            Default
                          </span>
                        )}
                      </div>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-spice-brown/70">Phone: {addr.phone}</p>
                    </div>
                  ))}
                </div>

                {/* Add Address Form */}
                <div className="pt-4 border-t border-spice-tan/40">
                  <h3 className="font-serif font-bold text-sm text-spice-brown mb-3">Add New Address</h3>
                  <form onSubmit={handleAddAddress} className="space-y-3 max-w-md">
                    <div>
                      <input
                        type="text"
                        required
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        placeholder="Street, flat, apartment number"
                        className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3 py-2 text-xs text-spice-brown"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        placeholder="City"
                        className="bg-spice-cream border border-spice-tan rounded-xl px-3 py-2 text-xs text-spice-brown"
                      />
                      <input
                        type="text"
                        required
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        placeholder="State"
                        className="bg-spice-cream border border-spice-tan rounded-xl px-3 py-2 text-xs text-spice-brown"
                      />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={newPincode}
                        onChange={(e) => setNewPincode(e.target.value)}
                        placeholder="Pincode"
                        className="bg-spice-cream border border-spice-tan rounded-xl px-3 py-2 text-xs text-spice-brown"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-spice-crimson text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-spice-deepRed transition-colors"
                    >
                      Save Address
                    </button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
