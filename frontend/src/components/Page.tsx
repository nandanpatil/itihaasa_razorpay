"use client"
import React, { useEffect } from 'react';
import FormComponent from './FormComponent';
import axios from 'axios';

// Define the Razorpay options type
interface RazorpayOptions {
  numberOfPeople: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  order_id?: string;
  handler?: (response: any) => void;
}

// Helper function to load the Razorpay script
const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const Page = () => {
  // Loading the Razorpay script when the page loads
  useEffect(() => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js');
  }, []);

  // Function to handle the Razorpay payment
  const handleRazorpayPayment = async (formData: { name: string; phone: string; email: string; number: number }) => {
    try {
      // Create order options
      const options: RazorpayOptions = {
        numberOfPeople: formData.number, // Razorpay works with paise, so multiply the amount by 100
        currency: 'INR',
        name: formData.name,
        description: 'Test Transaction',
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#007bff',
        },
      };

      // Create order on the server
      const res = await axios.post('http://localhost:4000/api/createorder', options);
      const data = res.data;
      console.log(data);
      // Initialize Razorpay payment
      const paymentObject = new (window as any).Razorpay({
        key: 'rzp_test_OV74PA4F46hr4j', // Replace with your Razorpay key
        order_id: data.id, // Assign the order_id from the response data
        ...options,
        handler: async (response: any) => {
          try {
            // Verify payment on the server
            const verificationOptions = {
              contact : formData.phone,
              numberOfPeople : formData.number,
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            };
            const verificationRes = await axios.post('http://localhost:4000/api/verifypayment', verificationOptions);
            if (verificationRes.data.success) {
              alert('Payment successful');
            } else {
              alert('Payment verification failed');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            alert('Payment verification error');
          }
        },
      });

      // Open the Razorpay payment form
      paymentObject.open();
    } catch (err) {
      console.error('Payment initiation error:', err);
      alert('Payment initiation error');
    }
  };

  return (
    <div>
      <FormComponent onSubmit={handleRazorpayPayment} />
    </div>
  );
};

export default Page;
