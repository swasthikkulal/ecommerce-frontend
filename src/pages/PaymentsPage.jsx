import React from "react";
import PaymentButton from "../components/PaymentButton";

const PaymentsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-8">
      {/* Animated Background Elements */}
      <div className="fixed top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 right-16 w-16 h-16 bg-indigo-300 rounded-full opacity-30 animate-bounce"></div>
      <div className="fixed top-1/3 right-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-25 animate-ping"></div>

      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-100 transform hover:scale-105 transition-transform duration-300">
        {/* Decorative Elements */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
            🔒 Secure
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Secure Payment
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your purchase securely
          </p>
        </div>

        {/* Payment Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">
              ₹{localStorage.getItem("total") || "0.00"}
            </span>
          </div>
        </div>

        {/* Security Features */}
        <div className="flex items-center justify-center space-x-6 mb-6 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>PCI DSS</span>
          </div>
        </div>

        {/* Payment Button Container */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-1 border border-gray-200">
          <PaymentButton />
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center space-x-4 mt-6 opacity-70">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-1">
              <span className="text-xs font-bold text-blue-600">VISA</span>
            </div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-1">
              <span className="text-xs font-bold text-yellow-600">MC</span>
            </div>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
              <span className="text-xs font-bold text-green-600">₹</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
