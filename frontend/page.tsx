import React, { useEffect } from 'react';
import FormComponent from './src/components/FormComponent';

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

  // Razorpay options for payment
  const handleRazorpayPayment = (formData: { name: string; phone: string; email: string; number: number }) => {
    const options = {
      key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
      amount: formData.number * 100, // Razorpay works with paise, so multiply the amount by 100
      currency: 'INR',
      name: formData.name,
      description: 'Test Transaction',
      handler: function (response: any) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: '#007bff',
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <div>
      <FormComponent onSubmit={handleRazorpayPayment} />
    </div>
  );
};

export default Page;
