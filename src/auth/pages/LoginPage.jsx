import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { Link } from 'react-router-dom';
import { useForm } from '../../hooks';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

const loginformFields = {
  correo: '',
  contraseña: '', 
}

export const LoginPage = () => {
  const { correo, contraseña, onInputChange: LoginImpuChange } = useForm( loginformFields ); // Llamada al hook useForm
  const { startLoginApi, errorMessage: messgeErrorAuthHook } = useAuth(); // Llamada al hook useAuth

  const onSubmit = (e) => {
    e.preventDefault();
    startLoginApi(correo, contraseña);
  }

  useEffect(() => {
    if( messgeErrorAuthHook !== undefined){
      Swal.fire('Error en la autenticacion', messgeErrorAuthHook, 'error')
    }
  }, [messgeErrorAuthHook]);


  return (
    <Box sx={containerStyle}>
      <form onSubmit={ onSubmit }>
        <Paper sx={paperStyle}>
          <Typography variant="h4" sx={titleStyle}>Iniciar Sesion</Typography>
          <TextField
            label="Correo"
            type="email"
            name='correo'
            value={correo}
            onChange={LoginImpuChange}
            sx={textFieldStyle}
            variant="outlined"
          />
          <TextField
            label="Contraseña"
            type="password"
            name='contraseña'
            value={contraseña}
            onChange={LoginImpuChange}
            sx={textFieldStyle}
            variant="outlined"
          />
          <Button variant="contained" type='submit' sx={buttonStyle} >
            Iniciar sesión
          </Button>
          <Typography>
            ¿No tienes una cuenta? <Link to="/auth/register" style={linkStyle}>Registrarse</Link>
          </Typography>
        </Paper>
      </form>
    </Box>
  )
}
  // Estilo para el contenedor principal
const containerStyle = {
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '100vh',
  
};

// Estilo para el Paper (papel) que contiene el formulario
const paperStyle = {
  padding: '50px 30px', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  width: '400px', 
  borderRadius: '25px', // Bordes redondeados más grandes
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)', // Sombra más pronunciada
};

// Estilo para el título
const titleStyle = {
  marginBottom: '25px', 
  color: '#FF1493', // Color rosa brillante
  fontWeight: 700, 
  textTransform: 'uppercase', // Transformación de texto en mayúsculas
  textShadow: '2px 2px 4px rgba(255, 20, 147, 0.5)', // Sombra de texto rosa
};

// Estilo para los campos de texto
const textFieldStyle = {
  marginBottom: '20px', 
  width: '100%', 
  borderColor: '#FF1493', 
  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderColor: '#FF1493', // Borde rosa brillante
  }
};

// Estilo para el botón
const buttonStyle = {
  marginTop: '25px', 
  width: '100%', 
  backgroundColor: '#FF1493', // Color de fondo rosa brillante
  color: '#ffffff', 
  fontWeight: 700, 
  '&:hover': {
    backgroundColor: '#FF69B4', 
  },
};

// Estilo para el enlace
const linkStyle = {
  marginTop: '20px', 
  textDecoration: 'none', 
  color: '#FF6347', // Color rojo brillante
  fontWeight: 700, 
  '&:hover': {
    textDecoration: 'underline', 
    color: '#FF1493', 
  },
};

