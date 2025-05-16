import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import About from './pages/About';
import CustomerLogin from './pages/CustomerLogin';
import VendorLogin from './pages/VendorLogin';
import VendorDashboard from './pages/VendorDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerRegister from './pages/CustomerRegister';
import VendorRegister from './pages/VendorRegister';
import Checkout from './pages/Checkout';
import './App.css';
import { CartProvider } from './context/CartContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Tab title mapping
const TAB_TITLES = {
  '/': 'Pillora | Home',
  '/products': 'Pillora | Products',
  '/about': 'Pillora | About',
  '/contact': 'Pillora | Contact',
  '/cart': 'Pillora | Cart',
  '/customer-login': 'Pillora | Customer Login',
  '/vendor-login': 'Pillora | Vendor Login',
  '/customer-dashboard': 'Pillora | Customer Dashboard',
  '/vendor-dashboard': 'Pillora | Vendor Dashboard',
  '/customer-register': 'Pillora | Customer Register',
  '/vendor-register': 'Pillora | Vendor Register',
  '/checkout': 'Pillora | Checkout'
};

// Wrapper to set document title
function PageWithTitle({ title, children }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return children;
}

function App() {
  const initialOptions = {
    "client-id": "test",
    currency: "USD",
    intent: "capture"
  };
  
  return (
    <PayPalScriptProvider options={initialOptions}>
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="App">
              <Navbar />
              <Routes>
                <Route path="/" element={
                  <PageWithTitle title={TAB_TITLES['/']}>
                    <Home />
                  </PageWithTitle>
                } />
                <Route path="/products" element={
                  <PageWithTitle title={TAB_TITLES['/products']}>
                    <Products />
                  </PageWithTitle>
                } />
                <Route path="/cart" element={
                  <PageWithTitle title={TAB_TITLES['/cart']}>
                    <Cart />
                  </PageWithTitle>
                } />
                <Route path="/about" element={
                  <PageWithTitle title={TAB_TITLES['/about']}>
                    <About />
                  </PageWithTitle>
                } />
                <Route path="/contact" element={
                  <PageWithTitle title={TAB_TITLES['/contact']}>
                    <Contact />
                  </PageWithTitle>
                } />
                <Route path="/customer-login" element={
                  <PageWithTitle title={TAB_TITLES['/customer-login']}>
                    <CustomerLogin />
                  </PageWithTitle>
                } />
                <Route path="/vendor-login" element={
                  <PageWithTitle title={TAB_TITLES['/vendor-login']}>
                    <VendorLogin />
                  </PageWithTitle>
                } />
                <Route
                  path="/vendor-dashboard"
                  element={
                    <PageWithTitle title={TAB_TITLES['/vendor-dashboard']}>
                      <ProtectedRoute>
                        <VendorDashboard />
                      </ProtectedRoute>
                    </PageWithTitle>
                  }
                />
                <Route 
                  path="/customer-dashboard" 
                  element={
                    <PageWithTitle title={TAB_TITLES['/customer-dashboard']}>
                      <ProtectedRoute>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    </PageWithTitle>
                  } 
                />
                <Route path="/customer-register" element={
                  <PageWithTitle title={TAB_TITLES['/customer-register']}>
                    <CustomerRegister />
                  </PageWithTitle>
                } />
                <Route path="/vendor-register" element={
                  <PageWithTitle title={TAB_TITLES['/vendor-register']}>
                    <VendorRegister />
                  </PageWithTitle>
                } />
                <Route 
                  path="/checkout" 
                  element={
                    <PageWithTitle title={TAB_TITLES['/checkout']}>
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    </PageWithTitle>
                  } 
                />
              </Routes>
              <ToastContainer 
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
