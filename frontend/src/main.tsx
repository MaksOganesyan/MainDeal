import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import { router } from './pages/router.tsx';
import Providers from './providers/Providers.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ru } from 'date-fns/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import theme from './theme/theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Providers>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
          <RouterProvider router={router} />
        </LocalizationProvider>
      </Providers>
    </ThemeProvider>
  </React.StrictMode>
);