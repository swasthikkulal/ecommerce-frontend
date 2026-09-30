import React from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

const PaymentButton = () => {
  const nav = useNavigate();
  const makePayment = async () => {
    const total = localStorage.getItem("total");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/payment/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "auth-token": token },
          body: JSON.stringify({
            products: [{ name: "icecream", price: total, quantity: 1 }],
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        alert(`❌ Payment API Error (${res.status}): ${errText}`);
        return;
      }

      const data = await res.json();
      console.log("Payment API response:", data);

      // ✅ Save MongoDB _id to localStorage
      if (data.paymentId) {
        localStorage.setItem("paymentId", data.paymentId);
        console.log("Saved paymentId:", data.paymentId);
      }

      const order = data.razorpayOrder;

      if (!order) {
        alert(`❌ Razorpay order not returned from server.\nServer response: ${JSON.stringify(data)}`);
        return;
      }

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

          // window.location.href = "/cartpage";
          nav("/orderplaced");
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
      className="btn btn-primary bg-green-400 w-[100%] py-4 rounded-md"
    >
      Pay Now
    </button>
  );
};

export default PaymentButton;
