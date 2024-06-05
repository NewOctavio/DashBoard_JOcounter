import React, { useEffect } from 'react'
import { useDatos } from '../../hooks'
import { Box, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

export const DashBoardPage = () => {
  const { totales } = useSelector(state => state.DashBoard)


  const totalesFormat = {
    valorUnitario_pin: totales.valorUnitario,
    importeCon_pin: totales.importeCon,
    importeIVA_pin: totales.importeIVA,
    total_pin: totales.total
  };

  const data01 = [
    {
      "name": "valorUnitario",
      "Importes": totalesFormat.valorUnitario_pin
    },
    {
      "name": "importe Total",
      "Importes": totalesFormat.importeCon_pin
    },
    {
      "name": "importe de IVA",
      "Importes": totalesFormat.importeIVA_pin
    },
    {
      "name": "Total",
      "Importes": totalesFormat.total_pin
    }
  ]

  console.log(data01)
  
  return (
    <Box>
      {/* <LineChart width={730} height={250} data={data01} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Importes" stroke="#8884d8" />
      </LineChart> */}

      <BarChart width={730} height={250} data={data01} margin={{ top: 50}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Importes" fill="#8884d8" />
      </BarChart>


    </Box>
  )
}
