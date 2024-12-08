import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Departments from './pages/Departments'
import Attendance from './pages/Attendance'
import Leaves from './pages/Leaves'

// Components
import Layout from './components/common/Layout'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Vérifier le token au chargement
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  // Composant pour les routes protégées
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    return <Layout>{children}</Layout>
  }

  // Validation des props pour ProtectedRoute
  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  return (
    <Routes>
      {/* Route publique */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
          <Navigate to="/" replace /> : 
          <Login onLogin={handleLogin} />
        } 
      />

      {/* Routes protégées */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        }
      />

      <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <Departments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaves"
        element={
          <ProtectedRoute>
            <Leaves />
          </ProtectedRoute>
        }
      />

      {/* Redirection des routes inconnues vers le dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App