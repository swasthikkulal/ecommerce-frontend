import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentButton = () => {
  const makePayment = async () => {
    const total = localStorage.getItem("total");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:3000/api/payment/create-order", // ✅ make sure your route matches backend
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "auth-token": token },
          body: JSON.stringify({
            products: [{ name: "icecream", price: total, quantity: 1 }],
          }),
        }
      );

      const data = await res.json();

      // ✅ Save MongoDB _id to localStorage
      if (data.paymentId) {
        localStorage.setItem("paymentId", data.paymentId);
        console.log("Saved paymentId:", data.paymentId);
      }

      const order = data.razorpayOrder;

      const options = {
        key: "rzp_test_ROAtsM0wOInprk", // Replace with your key
        amount: order.amount,
        currency: order.currency,
        name: "My Ecom Store",
        description: "Test Transaction",
        order_id: order.id,
        handler: function (response) {
          alert(`✅ Payment Successful! 
          Payment ID: ${response.razorpay_payment_id}
          Order ID: ${response.razorpay_order_id}`);

          localStorage.setItem("success", true);
          window.location.href = "/orderplaced";
        },
        prefill: {
          name: "Raj Swasthik",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
    }
  };

  return (
    <button
      onClick={makePayment}
      className="btn btn-primary bg-green-400 px-2 py-3 rounded-md"
    >
      Pay Now
    </button>
  );
};

export default PaymentButton;
