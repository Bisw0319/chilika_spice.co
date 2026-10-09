import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const AddressContext = createContext(null);

const STORAGE_KEY = 'chilika_default_address';

export const AddressProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [defaultAddress, setDefaultAddressState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Sync with user's saved addresses when logged in
  useEffect(() => {
    if (isAuthenticated && user?.addresses && user.addresses.length > 0) {
      const userDef = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      if (userDef) {
        const mapped = {
          fullName: userDef.fullName || user.name || '',
          phone: userDef.phone || user.phone || '',
          street: userDef.street || '',
          city: userDef.city || 'Bhubaneswar',
          state: userDef.state || 'Odisha',
          pincode: userDef.pincode || '',
          isDefault: true
        };
        setDefaultAddressState(mapped);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        } catch {}
      }
    }
  }, [isAuthenticated, user]);

  const saveDefaultAddress = useCallback(async (newAddress) => {
    const cleanAddress = {
      fullName: newAddress.fullName?.trim() || '',
      phone: newAddress.phone?.trim() || '',
      street: newAddress.street?.trim() || '',
      city: newAddress.city?.trim() || 'Bhubaneswar',
      state: newAddress.state?.trim() || 'Odisha',
      pincode: newAddress.pincode?.trim() || '',
      isDefault: true
    };

    setDefaultAddressState(cleanAddress);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanAddress));
    } catch (e) {
      console.warn('Could not save address to localStorage:', e);
    }

    // If user is authenticated, sync with backend database
    if (isAuthenticated) {
      try {
        await api.saveDefaultAddress(cleanAddress);
      } catch (err) {
        console.warn('Could not sync default address to account:', err);
      }
    }
    return cleanAddress;
  }, [isAuthenticated]);

  const clearDefaultAddress = () => {
    setDefaultAddressState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const openAddressModal = () => setIsAddressModalOpen(true);
  const closeAddressModal = () => setIsAddressModalOpen(false);

  return (
    <AddressContext.Provider
      value={{
        defaultAddress,
        saveDefaultAddress,
        clearDefaultAddress,
        isAddressModalOpen,
        openAddressModal,
        closeAddressModal
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};
