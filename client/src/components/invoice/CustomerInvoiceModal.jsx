import React from 'react';
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CustomerInvoiceModal = ({ order, isOpen, onClose, storeSettings }) => {
  if (!isOpen || !order) return null;

  const invoiceNo = order.invoiceNumber || `INV-${order.orderId}`;
  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const shipper = {
    name: storeSettings?.shipperName || 'Chilika Spices Pvt. Ltd.',
    address: storeSettings?.shipperAddress || 'Plot 108, Chilika Coastal Road, Balugaon, Dist: Khordha',
    cityState: `${storeSettings?.shipperCity || 'Chilika'}, ${storeSettings?.shipperState || 'Odisha'} - ${storeSettings?.shipperPincode || '752030'}`,
    phone: storeSettings?.shipperPhone || '+91 96686 59633',
    email: 'care@chilikaspices.com',
    fssai: storeSettings?.fssaiNumber || '12026001000888',
    gstin: storeSettings?.gstNumber || '21AABCC1234D1Z8'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Strict Print CSS: Ensures ONLY the invoice is printed */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          body * {
            visibility: hidden !important;
          }
          #customer-invoice-sheet, #customer-invoice-sheet * {
            visibility: visible !important;
          }
          #customer-invoice-sheet {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 15px !important;
            background: #ffffff !important;
            border: none !important;
            box-shadow: none !important;
            z-index: 9999999 !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-spice-tan/50 overflow-hidden my-4 print:border-none print:shadow-none print:rounded-none print:my-0">
        {/* Modal Controls (Hidden in Print) */}
        <div className="bg-spice-cream px-6 py-3 border-b border-spice-tan/40 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span className="text-xs font-bold text-spice-brown uppercase tracking-wider">
              Customer Tax Invoice & Receipt
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-spice-crimson transition-colors rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div id="customer-invoice-sheet" className="p-6 sm:p-10 space-y-6 text-gray-800 text-xs bg-white font-sans">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-spice-crimson/80">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <img
                  src="/images/brand/chilika-logo.jpg"
                  alt="Chilika Spices"
                  className="h-12 w-auto rounded object-contain border border-spice-tan/40 shadow-xs"
                />
                <div>
                  <h1 className="font-serif font-black text-xl text-spice-crimson tracking-tight">
                    CHILIKA SPICES
                  </h1>
                  <p className="text-[10px] text-spice-brown/70 italic">
                    From village to your kitchen • Pure & Authentic Odisha Spices
                  </p>
                </div>
              </div>
              <div className="text-[11px] text-gray-600 leading-relaxed">
                <p>{shipper.address}</p>
                <p>{shipper.cityState}</p>
                <p>Phone: {shipper.phone} | Email: {shipper.email}</p>
                <p className="font-semibold text-gray-700">FSSAI Lic: {shipper.fssai} | GSTIN: {shipper.gstin}</p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-spice-cream/60 p-3.5 rounded-2xl border border-spice-tan/40 min-w-[200px]">
              <span className="text-[10px] uppercase font-bold tracking-widest text-spice-crimson block">
                TAX INVOICE
              </span>
              <p className="font-mono font-bold text-sm text-gray-900 mt-0.5">{invoiceNo}</p>
              <p className="text-[11px] text-gray-500 mt-1">Invoice Date: {invoiceDate}</p>
              <p className="text-[11px] text-gray-500">Order ID: <strong className="font-mono text-gray-900">{order.orderId}</strong></p>
            </div>
          </div>

          {/* Customer & Payment Info Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50/80 p-4 rounded-2xl border border-gray-200">
            <div>
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1.5 text-spice-crimson">
                Billed & Shipped To:
              </h3>
              <p className="font-bold text-gray-900 text-sm">{order.shippingAddress?.fullName}</p>
              <p className="text-gray-600 leading-relaxed text-[11px]">
                {order.shippingAddress?.street}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - <strong>{order.shippingAddress?.pincode}</strong>
              </p>
              <p className="text-gray-600 mt-1 text-[11px]">Mobile: {order.shippingAddress?.phone}</p>
              {order.shippingAddress?.email && <p className="text-gray-600 text-[11px]">Email: {order.shippingAddress.email}</p>}
            </div>

            <div>
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1.5 text-spice-crimson">
                Payment & Fulfillment Details:
              </h3>
              <div className="text-[11px] space-y-1 text-gray-600">
                <p>
                  <strong>Payment Mode:</strong>{' '}
                  <span className="uppercase font-bold text-gray-900">
                    {order.paymentMethod === 'upi' ? 'Direct UPI Transfer' : order.paymentMethod.toUpperCase()}
                  </span>
                </p>
                <p>
                  <strong>Payment Status:</strong>{' '}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </p>
                {order.paymentDetails?.utrNumber && (
                  <p>
                    <strong>UPI UTR / Reference:</strong>{' '}
                    <span className="font-mono font-bold text-spice-crimson">{order.paymentDetails.utrNumber}</span>
                  </p>
                )}
                <p><strong>Courier Partner:</strong> {order.courierPartner || 'Express Logistics'}</p>
                <p><strong>Tracking AWB:</strong> <span className="font-mono">{order.trackingNumber || 'Assigned upon dispatch'}</span></p>
              </div>
            </div>
          </div>

          {/* Itemized Spices Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 text-[11px] uppercase tracking-wider text-gray-600 font-bold bg-gray-100/70">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Spice Item Description</th>
                  <th className="py-2.5 px-3">Size / Pack</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="text-xs">
                    <td className="py-3 px-3 text-gray-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-gray-900 block">{item.productName}</span>
                      <span className="text-[10px] text-gray-500">100% Pure, Unadulterated Village Ground Spice</span>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-700">{item.size || '100g'}</td>
                    <td className="py-3 px-3 text-center font-bold text-gray-900">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-gray-700">₹{item.price}</td>
                    <td className="py-3 px-3 text-right font-bold text-gray-900">₹{item.subtotal || item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary and Total Box */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t-2 border-gray-200">
            <div className="text-[11px] text-gray-500 space-y-1 max-w-sm">
              <p className="font-bold text-gray-700">Customer Terms & Notes:</p>
              <p>• All spices are packed in vacuum-sealed hygienic food grade packages.</p>
              <p>• For any replacement or queries, WhatsApp us at {shipper.phone} within 48 hours of delivery.</p>
              <p className="italic text-gray-400 mt-2">Thank you for supporting traditional Odisha farmers & village spice mills!</p>
            </div>

            <div className="w-full sm:w-64 bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-800">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges:</span>
                <span>{order.shippingCost === 0 ? <strong className="text-green-700">FREE</strong> : `₹${order.shippingCost}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between font-serif font-black text-base text-spice-crimson">
                <span>Total Amount:</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Digital Signature & Stamp */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-end gap-4">
            <div className="flex items-center space-x-2 text-[10px] text-gray-500">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <span>This is an official computer-generated Tax Invoice and requires no physical signature.</span>
            </div>

            <div className="text-right">
              <div className="w-32 border-b border-gray-300 pb-1 mb-1 mx-auto sm:ml-auto">
                <span className="font-serif italic font-bold text-spice-crimson text-sm block">Chilika Spices</span>
              </div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Authorized Signatory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
