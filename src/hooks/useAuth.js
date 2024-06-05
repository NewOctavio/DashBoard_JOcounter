import { useDispatch, useSelector } from "react-redux";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store/Auth/authSlice";
import impuestosApi from "../api/impuestosApi";


export const useAuth = () => {
    const { status, user, errorMessage } = useSelector(state => state.auth)
    const dispatch = useDispatch();

    
    const startLoginApi = async(email, password) => {
        dispatch( onChecking() )
        
        try {
            const {data} = await impuestosApi.post('/auth/', { email, password });
            dispatch( onLogin(data))
            localStorage.setItem('token', data.token ); // Guardar token en localstorage
            localStorage.setItem('token-init-date', new Date().getTime() ); // Fecha actual

        } catch (error) {
            dispatch( onLogout( 'Correo o contraseña Incorrectas' ))
            setTimeout(() => {
                dispatch( clearErrorMessage() )//Limpiar el mensaje de error
            }, 10);


            
        }

    }

    const startRegisterApi = async(nombre, apellido, correo, contraseña, repetirContraseña) => {
        if(nombre === '' || apellido === '' || correo === '' || contraseña === '' || repetirContraseña === '') return dispatch( onLogout('Todos los campos son obligatorios') )
        if(contraseña !== repetirContraseña) return dispatch( onLogout('Las contraseñas no coinciden') )
        dispatch( onChecking() )
        try {
            const {data} = await impuestosApi.post('/auth/register', { nombre, apellido, email: correo, password: contraseña });
            dispatch( onLogin(data))
            localStorage.setItem('token', data.token ); // Guardar token en localstorage
            localStorage.setItem('token-init-date', new Date().getTime() ); // Fecha actual

        } catch (error) {
            console.log(error)
            dispatch( onLogout( error.response.data.msg))
            setTimeout(() => {
                dispatch( clearErrorMessage() )//Limpiar el mensaje de error
            }, 10);
            
        }    
    }

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if(!token) return dispatch( onLogout() )
        try {
            const { data } = await impuestosApi.get('/auth/renew');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime() ); // Fecha actual

            dispatch( onLogin(data) )

            
        }
        catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }
    }
    const startLogoutApi = () => {
        localStorage.clear();
        dispatch( onLogout() );
    }
  




    return {
        //Propiedades
        status,
        user,
        errorMessage,

        //Metodos
        startLoginApi,
        checkAuthToken,
        startLogoutApi,
        startRegisterApi

    }
}
