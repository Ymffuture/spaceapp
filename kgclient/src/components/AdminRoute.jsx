import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

// Matches the admin check already used elsewhere in the app (BlogCard.jsx).
// Once you set role: "admin" on your user in the database, you can switch
// this to check user.role === 'admin' instead — the backend already
// supports both (see middleware/isAdmin.js).
const ADMIN_EMAIL = 'futurekgomotso@gmail.com'

const AdminRoute = ({ children }) => {
  const { user } = useSelector(store => store.auth)

  if (!user) return <Navigate to="/login" replace />
  if (user.email !== ADMIN_EMAIL && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
