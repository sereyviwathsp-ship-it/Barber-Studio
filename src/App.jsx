import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AdminRoute from './components/AdminRoute'
import HomePage from './pages/HomePage'
import Booking from './pages/Booking'
import FAQ from './pages/FAQ'
import Auth from './pages/Auth'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOverview from './pages/admin/AdminOverview'
import AdminBookings from './pages/admin/AdminBookings'
import AdminQuestions from './pages/admin/AdminQuestions'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <div className="barber-app">
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="questions" element={<AdminQuestions />} />
        </Route>
      </Routes>
    </div>
  )
}
