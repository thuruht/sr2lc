import React from 'react';

function PayPalInstructions() {
  return (
    <div>
      <h1>How to get your PayPal API Credentials</h1>
      <p>To connect your shop to PayPal, I need your PayPal API credentials. Here is a step-by-step guide on how to find them.</p>
      
      <h2>Step 1: Log in to your PayPal Developer Dashboard</h2>
      <p>
        <a href="https://developer.paypal.com/dashboard/" target="_blank" rel="noopener noreferrer">Click here to go to the PayPal Developer Dashboard</a> and log in with your PayPal Business account credentials. If you don't have a business account, you will need to create one.
      </p>

      <h2>Step 2: Find your REST API apps</h2>
      <p>
        After logging in, you should see a section called "REST API apps".
      </p>

      <h2>Step 3: Get your Client ID and Secret</h2>
      <p>
        Your "Default Application" will have a <strong>Client ID</strong> and a <strong>Client Secret</strong>. Please copy both of these values.
      </p>
      <p>
        <strong>Important:</strong> The Client Secret is like a password. Do not share it with anyone other than me.
      </p>

      <h2>Step 4: Send me the credentials</h2>
      <p>
        Please send me the Client ID and Client Secret you copied.
      </p>
    </div>
  );
}

export default PayPalInstructions;
