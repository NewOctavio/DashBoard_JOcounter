import { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Container, TablePagination
} from '@mui/material';
import { useDatos } from '../../hooks';
import { DashBoardPage } from '../../dashboard/pages/DashBoardPage';

const appBarStyles = {
  backgroundColor: '#ff69b4',
};

const toolbarStyles = {
  display: 'flex',
  justifyContent: 'space-between',
};

const containerStyles = {
  padding: '20px 0',
  backgroundColor: '#ffe4e1',
  minHeight: '100vh',
};

const titleStyles = {
  marginBottom: '20px',
  color: '#ff69b4',
};

const inputContainerStyles = {
  display: 'flex',
  gap: '10px',
  margin: '20px 0',
  flexDirection: 'column',
};

const tableContainerStyles = {
  marginTop: '20px',
  border: '1px solid #ff69b4',
};

const totalSumStyles = {
  marginTop: '20px',
  color: '#ff69b4',
};

export const ImpuestosPage = () => {
  const { Datos_DashBoard, totales } = useDatos();
  const [xmlData, setXmlData] = useState([]);
  const [showView, setShowView] = useState(false); // Nuevo estado para mostrar la vista
  const [filteredData, setFilteredData] = useState([]);
  const [excludedCount, setExcludedCount] = useState(0);
  const [totalSums, setTotalSums] = useState({
    valorUnitario: 0,
    importeCon: 0,
    importeIVA: 0,
    total: 0,
  });
  const [filters, setFilters] = useState({
    rfc: '',
    tipo: '',
    ano: '',
    mes: '',
  });

  const [page, setPage] = useState(0); // Nuevo estado para la página actual
  const [rowsPerPage, setRowsPerPage] = useState(10); // Nuevo estado para la cantidad de filas por página

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    Promise.all(files.map(file => new Promise((resolve, reject) => {
      if (file && file.type === 'text/xml') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(e.target.result, "application/xml");

          // Analizar XML para extraer datos relevantes
          const extractedData = [];
          const comprobantes = xmlDoc.getElementsByTagName('cfdi:Comprobante');
          let localExcludedCount = 0;
          for (let i = 0; i < comprobantes.length; i++) {
            const comprobante = comprobantes[i];
            const emisor = comprobante.getElementsByTagName('cfdi:Emisor')[0];
            const receptor = comprobante.getElementsByTagName('cfdi:Receptor')[0];
            const conceptos = comprobante.getElementsByTagName('cfdi:Concepto');
            const timbre = comprobante.getElementsByTagName('tfd:TimbreFiscalDigital')[0];
            const impuestos = comprobante.getElementsByTagName('cfdi:Impuestos')[0];
            const traslado = impuestos ? impuestos.getElementsByTagName('cfdi:Traslado')[0] : null;

            const regimenFiscal = emisor?.getAttribute('RegimenFiscal');

            // '601', '603', '608', '610', '626', '623'
            if (!['601', '603', '608', '610', '626', '623'].includes(regimenFiscal)) { // Filtra personas morales
              for (let j = 0; j < conceptos.length; j++) {
                const concepto = conceptos[j];
                extractedData.push({
                  version: comprobante.getAttribute('Version'),
                  serie: comprobante.getAttribute('Serie'),
                  folio: comprobante.getAttribute('Folio'),
                  fechaEmision: comprobante.getAttribute('Fecha'),
                  fechaTimbrado: timbre?.getAttribute('FechaTimbrado'),
                  subtotal: comprobante.getAttribute('SubTotal'),
                  moneda: comprobante.getAttribute('Moneda'),
                  total: comprobante.getAttribute('Total'),
                  metodoPago: comprobante.getAttribute('MetodoPago'),
                  lugarExpedicion: comprobante.getAttribute('LugarExpedicion'),

                  rfcEmisor: emisor?.getAttribute('Rfc'),
                  nombreEmisor: emisor?.getAttribute('Nombre'),
                  regimenFiscal,

                  rfcReceptor: receptor?.getAttribute('Rfc'),
                  nombreReceptor: receptor?.getAttribute('Nombre'),

                  cantidad: concepto.getAttribute('Cantidad'),
                  claveUnidad: concepto.getAttribute('ClaveUnidad'),
                  descripcion: concepto.getAttribute('Descripcion'),
                  valorUnitario: concepto.getAttribute('ValorUnitario'),
                  importeCon: concepto.getAttribute('Importe'),

                  cod_impuesto: traslado?.getAttribute('Impuesto'),
                  tipoFactor: traslado?.getAttribute('TipoFactor'),
                  tasaOCuota: traslado?.getAttribute('TasaOCuota'),
                  importeIVA: traslado?.getAttribute('Importe'),
                  uuid: timbre?.getAttribute('UUID'),
                });
              }
            } else {
              localExcludedCount++;
            }
          }
          resolve({ extractedData, localExcludedCount });
        };
        reader.readAsText(file);
      } else {
        reject(new Error("Por favor, selecciona un archivo XML válido."));
      }
    })))
    .then(results => {
      const combinedData = results.flatMap(result => result.extractedData);
      Datos_DashBoard(combinedData);
      const totalExcluded = results.reduce((sum, result) => sum + result.localExcludedCount, 0);
      const totalSums = {
        valorUnitario: combinedData.reduce((sum, item) => sum + parseFloat(item.valorUnitario || 0), 0),
        importeCon: combinedData.reduce((sum, item) => sum + parseFloat(item.importeCon || 0), 0),
        importeIVA: combinedData.reduce((sum, item) => sum + parseFloat(item.importeIVA || 0), 0),
        total: combinedData.reduce((sum, item) => sum + parseFloat(item.total || 0), 0),
      };
      totales(totalSums)
      setXmlData(combinedData);
      setFilteredData(combinedData);
      setExcludedCount(totalExcluded);
      setTotalSums(totalSums);
    })
    .catch(error => {
      console.error(error.message);
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleCambiarView = () => {
    setShowView(!showView);
  };

  const applyFilters = () => {
    const filteredData = xmlData.filter(item =>
      (filters.rfc ? item.rfcEmisor.includes(filters.rfc) : true) &&
      (filters.tipo ? item.tipoFactor === filters.tipo : true) &&
      (filters.ano ? new Date(item.fechaEmision).getFullYear().toString() === filters.ano : true) &&
      (filters.mes ? (new Date(item.fechaEmision).getMonth() + 1).toString().padStart(2, '0') === filters.mes : true)
    );

    setFilteredData(filteredData);

    const totalSums = {
      valorUnitario: filteredData.reduce((sum, item) => sum + parseFloat(item.valorUnitario || 0), 0),
      importeCon: filteredData.reduce((sum, item) => sum + parseFloat(item.importeCon || 0), 0),
      importeIVA: filteredData.reduce((sum, item) => sum + parseFloat(item.importeIVA || 0), 0),
      total: filteredData.reduce((sum, item) => sum + parseFloat(item.total || 0), 0),
    };
    setTotalSums(totalSums);
  };

  const resetFilters = () => {
    setFilters({
      rfc: '',
      tipo: '',
      ano: '',
      mes: '',
    });
    setFilteredData(xmlData);
    const totalSums = {
      valorUnitario: xmlData.reduce((sum, item) => sum + parseFloat(item.valorUnitario || 0), 0),
      importeCon: xmlData.reduce((sum, item) => sum + parseFloat(item.importeCon || 0), 0),
      importeIVA: xmlData.reduce((sum, item) => sum + parseFloat(item.importeIVA || 0), 0),
      total: xmlData.reduce((sum, item) => sum + parseFloat(item.total || 0), 0),
    };
    setTotalSums(totalSums);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //xdddddd
  return (
    <Box sx={containerStyles}>
      <AppBar position="static" sx={appBarStyles}>
        <Toolbar sx={toolbarStyles}>
          <Typography variant="h6" component="div">
            JO Counter
          </Typography>
          <Button variant="contained" component="label">
            Abrir XML
            <input type="file" hidden accept=".xml" multiple onChange={handleFileChange} />
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Box sx={inputContainerStyles}>
          <Typography variant="h4" sx={titleStyles}>
            Visor de comprobantes Fiscales generales
          </Typography>
          <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <TextField label="RFC" variant="outlined" size="small" name="rfc" value={filters.rfc} onChange={handleFilterChange} />
            <TextField label="Tipo" variant="outlined" size="small" name="tipo" value={filters.tipo} onChange={handleFilterChange} />
            <TextField label="Año" variant="outlined" size="small" name="ano" value={filters.ano} onChange={handleFilterChange} />
            <TextField label="Mes" variant="outlined" size="small" name="mes" value={filters.mes} onChange={handleFilterChange} />
            <Button variant="contained" onClick={applyFilters}>Buscar</Button>
            <Button variant="outlined" onClick={resetFilters}>Restablecer</Button>
          </Box>
        </Box>
        
        <Typography variant="h6" sx={totalSumStyles}>
          Total Valor Unitario: ${totalSums.valorUnitario.toLocaleString()} <br />
          Total Importe: ${totalSums.importeCon.toLocaleString()} <br />
          Total Importe(IVA): ${totalSums.importeIVA.toLocaleString()} <br />
          Total: ${totalSums.total.toLocaleString()} <br />
          Documentos de nómina descartados: {excludedCount}
        </Typography>
        
        <TableContainer component={Paper} sx={tableContainerStyles}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Version</TableCell>
                <TableCell>Serie</TableCell>
                <TableCell>Folio</TableCell>
                <TableCell>Fecha emisión</TableCell>
                <TableCell>Fecha timbrado</TableCell>
                <TableCell>RFC emisor</TableCell>
                <TableCell>Nombre emisor</TableCell>
                <TableCell>Régimen fiscal</TableCell>
                <TableCell>RFC receptor</TableCell>
                <TableCell>Nombre receptor</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Clave unidad</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Valor unitario</TableCell>
                <TableCell>Importe</TableCell>
                <TableCell>Codigo Impuesto</TableCell>
                <TableCell>Tipo factor</TableCell>
                <TableCell>Tasa o cuota</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Importe del IVA</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Moneda</TableCell>
                <TableCell>Método de pago</TableCell>
                <TableCell>Lugar de expedición</TableCell>
                <TableCell>UUID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.version}</TableCell>
                  <TableCell>{item.serie}</TableCell>
                  <TableCell>{item.folio}</TableCell>
                  <TableCell>{item.fechaEmision}</TableCell>
                  <TableCell>{item.fechaTimbrado}</TableCell>
                  <TableCell>{item.rfcEmisor}</TableCell>
                  <TableCell>{item.nombreEmisor}</TableCell>
                  <TableCell>{item.regimenFiscal}</TableCell>
                  <TableCell>{item.rfcReceptor}</TableCell>
                  <TableCell>{item.nombreReceptor}</TableCell>
                  <TableCell>{item.cantidad}</TableCell>
                  <TableCell>{item.claveUnidad}</TableCell>
                  <TableCell>{item.descripcion}</TableCell>
                  <TableCell>${parseFloat(item.valorUnitario).toLocaleString()}</TableCell>
                  <TableCell>${parseFloat(item.importeCon).toLocaleString()}</TableCell>
                  <TableCell>{item.cod_impuesto}</TableCell>
                  <TableCell>{item.tipoFactor}</TableCell>
                  <TableCell>{item.tasaOCuota}</TableCell>
                  <TableCell>${parseFloat(item.subtotal).toLocaleString()}</TableCell>
                  <TableCell>${parseFloat(item.importeIVA).toLocaleString()}</TableCell>
                  <TableCell>${parseFloat(item.total).toLocaleString()}</TableCell>
                  <TableCell>{item.moneda}</TableCell>
                  <TableCell>{item.metodoPago}</TableCell>
                  <TableCell>{item.lugarExpedicion}</TableCell>
                  <TableCell>{item.uuid}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Container>
      <Box sx={{ ml: 2 }}>
        <Button variant="contained" onClick={handleCambiarView}>Mostrar Dashboard</Button>
        {showView ? <DashBoardPage /> : null}
      </Box>
    </Box>

  );
}
