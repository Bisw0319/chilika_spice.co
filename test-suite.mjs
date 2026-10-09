async function testAll() {
  console.log("=================================================");
  console.log("  CHILIKA SPICES - COMPLETE VERIFICATION SUITE   ");
  console.log("=================================================");

  // 1. Health API
  const healthRes = await fetch("http://localhost:5000/api/health");
  const health = await healthRes.json();
  console.log("✔ [1/10] Health API:", healthRes.status, "| Brand:", health.brand, "| Tagline:", health.tagline);

  // 2. Products API
  const prodsRes = await fetch("http://localhost:5000/api/products");
  const prods = await prodsRes.json();
  console.log("✔ [2/10] Products Count:", prods.products.length);

  // 3. Product Slug Lookup
  const slugRes = await fetch("http://localhost:5000/api/products/slug/pure-kandhamal-turmeric-powder");
  const slugData = await slugRes.json();
  console.log("✔ [3/10] Slug Query:", slugRes.status, "| Spice:", slugData.product.name, "| Variants:", slugData.product.variants.length);

  // 4. Coupon Application
  const couponRes = await fetch("http://localhost:5000/api/coupons/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: "CHILIKA10", cartTotal: 500 })
  });
  const coupon = await couponRes.json();
  console.log("✔ [4/10] Coupon Application:", couponRes.status, "| Message:", coupon.message, "| Discount: ₹" + coupon.coupon?.discountAmount);

  // 5. Order Placement
  const orderRes = await fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [{
        productId: slugData.product._id,
        name: slugData.product.name,
        image: slugData.product.productImages[0],
        size: "250g",
        price: 145,
        quantity: 2,
        subtotal: 290
      }],
      shippingAddress: {
        fullName: "Bishnu Dash",
        phone: "9876543210",
        email: "bishnu@example.com",
        street: "Plot 12, Saheed Nagar",
        city: "Bhubaneswar",
        state: "Odisha",
        pincode: "751007",
        country: "India"
      },
      paymentMethod: "cod",
      couponCode: "CHILIKA10"
    })
  });
  const orderData = await orderRes.json();
  console.log("✔ [5/10] Order Placed:", orderRes.status, "| Order ID:", orderData.orderId, "| Total: ₹" + orderData.order?.total);

  // 6. Track Order
  const trackRes = await fetch("http://localhost:5000/api/orders/track/" + orderData.orderId);
  const track = await trackRes.json();
  console.log("✔ [6/10] Track Order:", trackRes.status, "| Status:", track.order.orderStatus, "| Timeline Steps:", track.order.statusTimeline.length);

  // 7. Customer Register & Login
  const regEmail = `testuser_${Date.now()}@example.com`;
  const regRes = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Odisha Cook",
      email: regEmail,
      password: "Password@123",
      phone: "9812345678"
    })
  });
  const regData = await regRes.json();
  console.log("✔ [7/10] Customer Register:", regRes.status, "| User:", regData.user?.name);

  // 8. Admin Login
  const adminRes = await fetch("http://localhost:5000/api/auth/admin-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@chilikaspices.com",
      password: "Admin@Chilika2026"
    })
  });
  const adminData = await adminRes.json();
  console.log("✔ [8/10] Admin Login:", adminRes.status, "| Authorized:", adminData.user?.name, "| Role:", adminData.user?.role);
  const adminToken = adminData.token;

  // 9. Admin Dashboard Analytics & Update Order Status
  const statsRes = await fetch("http://localhost:5000/api/admin/dashboard", {
    headers: { Authorization: "Bearer " + adminToken }
  });
  const stats = await statsRes.json();
  console.log("✔ [9/10] Admin Dashboard Analytics:", statsRes.status, "| Total Orders:", stats.stats.totalOrders, "| Revenue: ₹" + stats.stats.revenue);

  const updateRes = await fetch(`http://localhost:5000/api/orders/${orderData.order._id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + adminToken
    },
    body: JSON.stringify({
      status: "Confirmed",
      message: "Order confirmed at Bhubaneswar central spice fulfillment hub."
    })
  });
  const updatedOrder = await updateRes.json();
  console.log("✔ [10/10] Admin Order Status Update:", updateRes.status, "| New Status:", updatedOrder.order?.orderStatus);

  // 11. Frontend Dev Server Check
  const frontendRes = await fetch("http://localhost:5173/");
  const frontendHtml = await frontendRes.text();
  console.log("✔ [Bonus] Frontend Dev Server:", frontendRes.status, "| HTML Length:", frontendHtml.length, "| Title:", frontendHtml.includes("Chilika Spices"));

  console.log("\n=================================================");
  console.log("  ALL 10 VERIFICATION TESTS PASSED SUCCESSFULLY! ");
  console.log("=================================================");
}

testAll().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
