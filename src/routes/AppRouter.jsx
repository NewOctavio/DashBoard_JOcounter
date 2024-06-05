import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthRoutes } from '../auth/routes/AuthRoutes'
import { ImpuestosRoutes } from '../impuestos/routes/ImpuestosRoutes'
import { useAuth } from '../hooks/useAuth'
import { CheckingAuth } from '../ui'
import { useDatos } from '../hooks'


export const AppRouter = () => {

  const { status, checkAuthToken } = useAuth();

  useEffect(() => {
    checkAuthToken();
  }, [])

  if(status === 'checking') return <CheckingAuth />

  return (
    <Routes>
      {/* Login y Registro */}

      {
        (status === 'autenticado')
        ? <Route path='/*' element={ <ImpuestosRoutes />}/> 
        : <Route path='/auth/*' element={ <AuthRoutes />}/>
        
      }
        

        <Route path='/*' element={<Navigate to='/auth/login'/>}/>
    </Routes>
  )
}
