import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MobileBottomNav } from '../components/common/MobileBottomNav';
import { FloatingWhatsApp } from '../components/common/FloatingWhatsApp';
import { DeliveryAddressModal } from '../components/common/DeliveryAddressModal';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-spice-cream selection:bg-spice-crimson selection:text-white">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <FloatingWhatsApp />
      <DeliveryAddressModal />
    </div>
  );
};
