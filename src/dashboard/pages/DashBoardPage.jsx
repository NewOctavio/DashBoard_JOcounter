import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Tooltip, MenuItem, Select, FormControl, InputLabel, Grid, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';

export const DashBoardPage = () => {
  const { totales, XMLs } = useSelector(state => state.DashBoard);

  // Acceder a XMLs[0] para obtener los datos reales
  const XMLsData = XMLs[0];
  console.log(XMLsData);

  // Formatear los datos de totales para el BarChart
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
  ];

  console.log(data01);

  // Obtener lista de años y meses disponibles
  const availableYears = [...new Set(XMLsData.map(item => new Date(item.fechaEmision).getFullYear()))];
  const availableMonths = [...Array(12).keys()].map(i => i + 1); // [1, 2, ..., 12]

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Filtrar datos por año y mes seleccionados
  const filteredData = XMLsData.filter(item => {
    const date = new Date(item.fechaEmision);
    return date.getFullYear() === selectedYear && (date.getMonth() + 1) === selectedMonth;
  });

  const dataForLineChart = filteredData.map(item => ({
    fechaEmision: format(new Date(item.fechaEmision), 'yyyy-MM-dd'),
    total: item.total,
    importeIVA: item.importeIVA
  }));

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Dashboard
      </Typography>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Año</InputLabel>
            <Select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
              {availableYears.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Mes</InputLabel>
            <Select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
              {availableMonths.map(month => (
                <MenuItem key={month} value={month}>
                  {month.toString().padStart(2, '0')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={5}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom align="center">
            Totales
          </Typography>
          <BarChart width={500} height={300} data={data01} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Importes" fill="#8884d8" />
          </BarChart>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom align="center">
            Gráfico de Líneas
          </Typography>
          {dataForLineChart.length > 0 ? (
            <LineChart width={500} height={300} data={dataForLineChart} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fechaEmision" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
              <Line type="monotone" dataKey="importeIVA" stroke="#82ca9d" />
            </LineChart>
          ) : (
            <Typography align="center">No hay datos disponibles para el gráfico de líneas.</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
