import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ImpuestosPage } from '../pages/ImpuestosPage'
import { DashBoardPage } from '../../dashboard/pages/DashBoardPage'

export const ImpuestosRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<ImpuestosPage />} />
        <Route path="/dashboard/" element={<DashBoardPage />} />
        <Route path="/dashboard/*" element={<Navigate to='/dashboard/' />} />
        <Route path="/*" element={<Navigate to='/' />} />

    </Routes>
  )
}
