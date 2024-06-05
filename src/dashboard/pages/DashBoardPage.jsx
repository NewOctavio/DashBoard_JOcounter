import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Tooltip, MenuItem, Select, FormControl, InputLabel, Grid, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';

export const DashBoardPage = () => {
  const { totales, XMLs } = useSelector(state => state.DashBoard);

  // Acceder a XMLs[0] para obtener los datos reales
  const XMLsData = XMLs[0];
  const totalesData = totales;

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

  // Calcular totales basados en los datos de totales
  const totalesFormat = {
    valorUnitario: totalesData.valorUnitario,
    importeCon: totalesData.importeCon,
    importeIVA: totalesData.importeIVA,
    total: totalesData.total
  };

  // Preparar datos para el gráfico de barras
  const dataForBarChart = Object.entries(totalesFormat).map(([name, value]) => ({
    name,
    Importes: value,
    total: value // Agregamos el total como propiedad para mostrarlo en el tooltip
  }));

  // Preparar datos para el gráfico de líneas
  const dataForLineChart = filteredData.map(item => ({
    fechaEmision: format(new Date(item.fechaEmision), 'yyyy-MM-dd'),
    total: item.total,
    importeIVA: item.importeIVA
  }));

  const paymentMethodTotals = XMLsData.reduce((acc, item) => {
    acc[item.metodoPago] = (acc[item.metodoPago] || 0) + Number(item.total) + Number(item.importeIVA); // Sumamos el total y el IVA
    return acc;
  }, {});

  // Calcular totales basados en los datos de totales agrupados por RFC
  const totalsByRFC = XMLsData.reduce((acc, item) => {
    const rfc = item.rfcEmisor;
    const total = Number(item.total) + Number(item.importeIVA); // Sumamos el total y el IVA
    acc[rfc] = (acc[rfc] || 0) + total;
    return acc;
  }, {});

  // Preparar datos para el gráfico de barras de totales por método de pago
  const dataForPaymentMethodChart = Object.entries(paymentMethodTotals).map(([method, total]) => ({
      name: method,
      Total: total
  }));

  const dataForBarChartRFC = Object.entries(totalsByRFC).map(([rfc, total]) => ({
    rfc,
    total
  }));

   // Calcular el total general de los subtotales y el total general del IVA
   const totalSubtotal = XMLsData.reduce((acc, item) => {
    const subtotal = Number(item.subtotal);
    acc.subtotal += subtotal;
    const importeIVA = Number(item.importeIVA);
    acc.importeIVA += importeIVA;
    return acc;
  }, { subtotal: 0, importeIVA: 0 });

  // Formatear los valores con separadores de miles y dos decimales
  const formattedSubtotal = totalSubtotal.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedImporteIVA = totalSubtotal.importeIVA.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Preparar datos para la gráfica de pastel
  const dataForPieChart = [
    { name: `Subtotal (${formattedSubtotal})`, value: totalSubtotal.subtotal },
    { name: `Importe IVA (${formattedImporteIVA})`, value: totalSubtotal.importeIVA }
  ];

  // Colores para las secciones del gráfico de pastel
  const COLORS = ['#0088FE', '#38DA18'];



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
          <BarChart width={500} height={300} data={dataForBarChart} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
            <Legend />
            <Bar dataKey="Importes" fill="#8884d8" label={{ position: 'top', fontSize: 12, fontWeight: 'bold', formatter: (value) => value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} />
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
            <Tooltip labelFormatter={(value) => `Fecha: ${value}`} formatter={(value, name) => [value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), name === 'total' ? 'Total' : 'Importe IVA']} />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" dot={{ stroke: '#8884d8', strokeWidth: 2, fill: '#8884d8' }} name="Total" />
            <Line type="monotone" dataKey="importeIVA" stroke="#82ca9d" dot={{ stroke: '#82ca9d', strokeWidth: 2, fill: '#82ca9d' }} name="Importe IVA" />
          </LineChart>
          
          ) : (
            <Typography align="center">No hay datos disponibles para el gráfico de líneas.</Typography>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom align="center">
            Totales por Método de Pago
          </Typography>
          <BarChart width={500} height={300} data={dataForPaymentMethodChart} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
            <Legend />
            <Bar dataKey="Total" fill="#82ca9d" />
          </BarChart>
        </Grid>


        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom align="center">
            Totales por RFC
          </Typography>
          <LineChart width={800} height={400} data={dataForLineChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rfc" />
            <YAxis />
            <Tooltip formatter={(value) => value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total" />
        </LineChart>

        </Grid>

        <Grid item xs={12} md={6}>
        <PieChart width={800} height={400}>
        <Pie
          data={dataForPieChart}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry) => entry.name}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {
            dataForPieChart.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))
          }
        </Pie>
        <Tooltip formatter={(value) => value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} />
        <Legend />
      </PieChart>
        </Grid>


        
      </Grid>
    </Box>
  );
};
