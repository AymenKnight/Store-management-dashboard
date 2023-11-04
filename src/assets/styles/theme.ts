import { createTheme } from '@mui/material/styles';

import color from './color';
export const theme = createTheme({
  palette: {
    primary: {
      main: 'rgba(44, 155, 200, 1)',
    },
    background: {
      default: '#ffffff',
    },
    text: {
      primary: 'rgba(64, 64, 64, 1)',
    },
    secondary: {
      main: 'rgba(64, 64, 64, 1)',
    },
    info: {
      main: 'rgba(64, 64, 64, 1)',
    },
  },
});
