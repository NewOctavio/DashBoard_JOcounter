import { useDispatch } from 'react-redux';
import { Datos_insert, totales_Insert} from '../store/dashboardData/dashboardSlice';

export const useDatos = () => {

    const dispatch = useDispatch();


    const Datos_DashBoard = (datos) => {
      dispatch(Datos_insert(datos));
    }

    const totales = (totales_data) => {
      dispatch(totales_Insert(totales_data));

    }

  return {
    //metodos
    Datos_DashBoard,
    totales

  }
  
}
