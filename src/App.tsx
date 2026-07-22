import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Poetry = lazy(() => import('./pages/Poetry'));
const IslamicQuotes = lazy(() => import('./pages/IslamicQuotes'));
const About = lazy(() => import('./pages/About'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPoetry = lazy(() => import('./pages/admin/AdminPoetry'));
const AdminQuotes = lazy(() => import('./pages/admin/AdminQuotes'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-amber-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-6 mx-auto" />
          <h1
            className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent"
            style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
          >
            عبدالواحد راشدی
          </h1>
          <p className="text-amber-200/60 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-white transition-colors duration-300">
          <Navbar />

          <Suspense fallback={<div className="min-h-screen pt-24 text-center text-amber-200" role="status">Loading page…</div>}>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/poetry" element={<Poetry />} />
              <Route path="/poetry/:slug" element={<Poetry />} />
              <Route path="/quotes" element={<IslamicQuotes />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />

              {/* Admin Login */}
              <Route path="/admin" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/poetry"
                element={
                  <ProtectedRoute>
                    <AdminPoetry />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/quotes"
                element={
                  <ProtectedRoute>
                    <AdminQuotes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/gallery"
                element={
                  <ProtectedRoute>
                    <AdminGallery />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/blog"
                element={
                  <ProtectedRoute>
                    <AdminBlog />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/messages"
                element={
                  <ProtectedRoute>
                    <AdminMessages />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AnimatePresence>
          </Suspense>

          <Footer />
          <ScrollToTop />
        </div>
      </Router>
    </ThemeProvider>
  );
}
