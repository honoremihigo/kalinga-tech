import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import { FaMoneyCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const RideSelectionForm = ({ show, closed }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);

  const closeModal = () => {
    setShowPaymentModal(false);
    setPaymentMethod(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {paymentMethod ? `Add ${paymentMethod}` : "Add Payment Method"}
            </h2>
            <MdClose
              className="text-gray-700 cursor-pointer"
              onClick={closed}
            />
          </div>

          {!paymentMethod ? (
            <div className="space-y-4">
              <div
                className="border p-3 rounded-lg cursor-pointer flex items-center gap-2"
                onClick={() => setPaymentMethod("Credit or Debit Card")}
              >
                <span>💳</span> Credit or Debit Card
              </div>
              <div
                className="border p-3 rounded-lg cursor-pointer flex items-center gap-2"
                onClick={() => setPaymentMethod("PayPal")}
              >
                <span>🅿️</span> PayPal
              </div>
              <div
                className="border p-3 rounded-lg cursor-pointer flex items-center gap-2"
                onClick={() => setPaymentMethod("Google Pay or Apple Pay")}
              >
                <span>🎁</span> Google Pay or Apple Pay
              </div>
            </div>
          ) : paymentMethod === "Credit or Debit Card" ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                className="border p-2 w-full rounded-md text-black"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="MM / YY"
                  className="border p-2 w-1/2 rounded-md text-black"
                />
                <input
                  type="text"
                  placeholder="Security Code"
                  className="border p-2 w-1/2 rounded-md text-black"
                />
              </div>
              <select className="border p-2 w-full rounded-md text-black">
                <option>Rwanda</option>
                <option>United States</option>
                <option>United Kingdom</option>
              </select>
              <input
                type="text"
                placeholder="Nickname (optional)"
                className="border p-2 w-full rounded-md text-black"
              />
              <button className="bg-black text-white px-6 py-2 w-full rounded-lg">
                Add Card
              </button>
            </div>
          ) : paymentMethod === "PayPal" ? (
            <div>
              <p className="text-gray-600">
                You will be re-directed to PayPal to verify your account.
              </p>
              <button className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 rounded-lg flex justify-center items-center text-lg">
                PayPal
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600">
                Complete your payment with Google Pay or Apple Pay.
              </p>
              <button className="mt-6 w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-lg flex justify-center items-center text-lg">
                Google Pay / Apple Pay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideSelectionForm;
