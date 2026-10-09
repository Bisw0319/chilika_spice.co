import React from 'react';
import { Printer, X, Truck, Package, QrCode, ShieldCheck, Check } from 'lucide-react';

export const CourierShippingLabelModal = ({ order, isOpen, onClose, storeSettings }) => {
  if (!isOpen || !order) return null;

  const awbNumber = order.trackingNumber || `EXP-OD-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const orderId = order.orderId;
  const isCod = order.paymentMethod === 'cod';
  const totalCollectible = isCod ? order.total : 0;
  const hubCode = storeSettings?.hubCode || 'HUB-OD-BBI01';
  const carrier = storeSettings?.courierPartner || 'Express Logistics';

  const shipper = {
    name: storeSettings?.shipperName || 'Chilika Spices Pvt. Ltd.',
    address: storeSettings?.shipperAddress || 'Plot 108, Chilika Coastal Road, Balugaon',
    city: storeSettings?.shipperCity || 'Chilika',
    state: storeSettings?.shipperState || 'Odisha',
    pincode: storeSettings?.shipperPincode || '752030',
    phone: storeSettings?.shipperPhone || '+91 96686 59633',
    gstin: storeSettings?.gstNumber || '21AABCC1234D1Z8',
    fssai: storeSettings?.fssaiNumber || '12026001000888'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Strict Print CSS: Ensures ONLY the courier shipping label is printed */}
      <style>{`
        @media print {
          @page {
            size: 4in 6in;
            margin: 4mm;
          }
          body * {
            visibility: hidden !important;
          }
          #courier-delivery-manifest, #courier-delivery-manifest * {
            visibility: visible !important;
          }
          #courier-delivery-manifest {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10px !important;
            background: #ffffff !important;
            border: 2px solid #000000 !important;
            box-shadow: none !important;
            z-index: 9999999 !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden my-4 print:border-none print:shadow-none print:rounded-none print:my-0">
        {/* Modal Controls (Hidden in Print) */}
        <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-spice-turmeric" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {carrier} — Courier Shipping Label & Dispatch Copy
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-spice-turmeric text-spice-charcoal hover:bg-yellow-400 rounded-xl text-xs font-black transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Shipping Label (4x6 / A4)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Courier Shipping Label & Manifest Sheet (Preserved Standard Courier Format) */}
        <div id="courier-delivery-manifest" className="p-6 sm:p-8 space-y-4 text-black text-xs font-sans border-4 border-black m-2 print:m-0 print:border-4 print:border-black bg-white">
          {/* Carrier Top Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-black">
            <div className="flex items-center space-x-2">
              <div className="bg-black text-white font-black px-2.5 py-1 rounded text-sm tracking-wider">
                EXPRESS
              </div>
              <div>
                <span className="font-black text-sm tracking-tight block">LOGISTICS DISPATCH</span>
                <span className="text-[9px] text-gray-600 font-bold block uppercase">Surface & Air Delivery Network</span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-xs font-bold text-gray-800">HUB: {hubCode}</div>
              <div className="text-[10px] text-gray-600">STD SURFACE EXPEDITE</div>
            </div>
          </div>

          {/* Barcode & AWB Simulation Section */}
          <div className="bg-gray-50 border-2 border-black p-3 text-center rounded-sm">
            <div className="text-[10px] uppercase font-bold tracking-widest text-gray-600 mb-1">
              Tracking / AWB Number
            </div>
            {/* High-contrast logistics barcode pattern */}
            <div className="flex justify-center items-end h-10 space-x-[2px] bg-white p-1 border border-gray-400 max-w-sm mx-auto">
              {[4,2,5,1,3,6,2,4,1,5,3,2,6,1,4,2,5,3,1,6,2,4,5,1,3,2,6,4,1,5,2,4,3,5,1,6].map((h, i) => (
                <div
                  key={i}
                  className="bg-black w-[3px]"
                  style={{ height: `${h * 5 + 10}px` }}
                />
              ))}
            </div>
            <div className="font-mono text-base font-black tracking-widest mt-1.5 text-black">
              {awbNumber}
            </div>
          </div>

          {/* Routing & Payment Collect Box */}
          <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black text-center">
            <div className="p-2.5 bg-gray-50">
              <span className="text-[10px] font-bold text-gray-600 block uppercase">Destination PIN</span>
              <span className="font-mono text-3xl font-black tracking-widest block text-black">
                {order.shippingAddress?.pincode || '752030'}
              </span>
              <span className="text-[10px] font-bold text-gray-700 block uppercase mt-0.5">
                {order.shippingAddress?.city || 'Bhubaneswar'}
              </span>
            </div>

            <div className={`p-2.5 flex flex-col justify-center items-center ${
              isCod ? 'bg-amber-100' : 'bg-emerald-50'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
                Payment Mode
              </span>
              <span className={`text-xl font-black tracking-wide ${
                isCod ? 'text-amber-900' : 'text-emerald-900'
              }`}>
                {isCod ? 'C.O.D.' : 'PREPAID'}
              </span>
              {isCod ? (
                <div className="mt-0.5 text-xs font-black text-red-700 bg-white px-2 py-0.5 rounded border border-red-300">
                  Collect ₹{totalCollectible}
                </div>
              ) : (
                <div className="mt-0.5 text-[10px] font-bold text-emerald-800">
                  Verified ₹0 to Collect
                </div>
              )}
            </div>
          </div>

          {/* Delivery & Shipper Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-2 border-black p-3">
            {/* Deliver To */}
            <div>
              <div className="font-black text-[11px] uppercase tracking-wider border-b border-black pb-1 mb-1.5 flex items-center justify-between">
                <span>Ship To / Consignee:</span>
                <span className="text-[9px] font-mono text-gray-600">ID: {orderId}</span>
              </div>
              <div className="space-y-0.5 leading-snug">
                <p className="font-black text-sm text-black">{order.shippingAddress?.fullName}</p>
                <p className="text-gray-800">{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && <p className="text-gray-800">{order.shippingAddress?.addressLine2}</p>}
                {order.shippingAddress?.landmark && <p className="text-gray-600 italic">Near: {order.shippingAddress?.landmark}</p>}
                <p className="font-bold text-black">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - <span className="font-mono">{order.shippingAddress?.pincode}</span>
                </p>
                <p className="font-bold text-black mt-1">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Return Address / Shipper */}
            <div className="sm:border-l sm:border-black sm:pl-3">
              <div className="font-black text-[11px] uppercase tracking-wider border-b border-black pb-1 mb-1.5">
                Return Address / Shipper:
              </div>
              <div className="space-y-0.5 text-[11px] leading-snug text-gray-800">
                <p className="font-bold text-black">{shipper.name}</p>
                <p>{shipper.address}</p>
                <p>{shipper.city}, {shipper.state} - {shipper.pincode}</p>
                <p>Phone: {shipper.phone}</p>
                <p className="text-[10px] text-gray-600">GST: {shipper.gstin}</p>
              </div>
            </div>
          </div>

          {/* Package Details & Itemized List */}
          <div className="border border-black p-2 bg-gray-50/70">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-700 pb-1 border-b border-gray-300 mb-1">
              <span>Package Count: 1 Box</span>
              <span>Weight: {((order.items?.length || 1) * 0.25).toFixed(2)} KG (Approx)</span>
              <span>Order Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
            </div>

            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="border-b border-gray-300 font-bold text-gray-600">
                  <th className="py-1">Item Description</th>
                  <th className="py-1 text-center">Pack</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-right">Declared Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-1 font-bold text-gray-900">{item.productName}</td>
                    <td className="py-1 text-center font-medium">{item.size || '100g'}</td>
                    <td className="py-1 text-center font-bold">{item.quantity}</td>
                    <td className="py-1 text-right font-bold">₹{item.subtotal || item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Courier Handover Tear Section */}
          <div className="border-t-2 border-dashed border-black pt-2 text-[9px] text-gray-600 flex justify-between items-center">
            <div>
              <span>Contents: Organic Non-Hazardous Food Spices</span><br />
              <span>Carrier: {carrier} Express Hub Handoff</span>
            </div>
            <div className="text-right">
              <span>Courier Delivery Associate Sign: ________________</span><br />
              <span>Date: ____/____/2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
