import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';


function LoginPage({ onLogin, onBack, onNavigateToSignUp }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);


  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);


    return () => {
      document.body.removeChild(script);
    };
  }, []);


  const initializeGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '713448377274-vkp9efs9nhm399l0cni208d83fuh4nl1.apps.googleusercontent.com', // Replace with your actual Client ID
        callback: handleGoogleResponse,
      });
      setIsGoogleLoaded(true);
    }
  };

  const handleGoogleResponse = async (response) => {
  console.log('Google response:', response);
  
  try {
    const payload = {
      credential: response.credential,
    };
    
    console.log('Sending to backend:', payload);
    
    const res = await fetch('http://localhost:8000/api/users/auth/google/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', res.status);
    
    const data = await res.json();
    console.log('Response data:', data);

    if (res.ok) {
      // Store tokens
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      onLogin(data.user || {});
    } else {
      console.error('Backend error:', data);
      setError(data.error || 'Google authentication failed');
    }
  } catch (err) {
    console.error('Google login error:', err);
    setError('Failed to authenticate with Google. Please try again.');
  }
};

const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt(); // Show One Tap dialog
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');


    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }


    // Your existing email/password login logic
    onLogin(formData);
  };

   return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-600">NihonLab</h1>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>


        <h2 className="text-2xl font-bold mb-8">Welcome back</h2>


        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}


        <button
          onClick={handleGoogleLogin}
          disabled={!isGoogleLoaded}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-3 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.8 10.2273C19.8 9.51821 19.7364 8.83639 19.6182 8.18182H10.2V12.0491H15.6109C15.3727 13.2909 14.6873 14.3382 13.6636 15.0473V17.5673H16.8727C18.7618 15.8382 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
            <path d="M10.2 20C12.9 20 15.1636 19.1045 16.8727 17.5673L13.6636 15.0473C12.8045 15.6682 11.6909 16.0227 10.2 16.0227C7.59545 16.0227 5.38182 14.2818 4.62 11.9L1.29545 14.4909C2.99091 17.8409 6.33545 20 10.2 20Z" fill="#34A853"/>
            <path d="M4.62 11.9C4.41818 11.2791 4.30455 10.6182 4.30455 9.93636C4.30455 9.25455 4.41818 8.59364 4.62 7.97273V5.38182H1.29545C0.590909 6.79091 0.2 8.34545 0.2 9.93636C0.2 11.5273 0.590909 13.0818 1.29545 14.4909L4.62 11.9Z" fill="#FBBC05"/>
            <path d="M10.2 3.85C11.8364 3.85 13.2909 4.42727 14.4636 5.54545L17.3091 2.7C15.1636 0.709091 12.9 -0.25 10.2 -0.25C6.33545 -0.25 2.99091 1.90909 1.29545 5.38182L4.62 7.97273C5.38182 5.58182 7.59545 3.85 10.2 3.85Z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>



        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or sign in with email</span>
          </div>
        </div>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>


          <button
            type="submit"
            className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition mt-2"
          >
            Sign in
          </button>
        </form>


        <p className="text-center text-gray-600 mt-6 text-sm">
          Don't have an account?{' '}
          <button
            onClick={onNavigateToSignUp}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}


export default LoginPage;
