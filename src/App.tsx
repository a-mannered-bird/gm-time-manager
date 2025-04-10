
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { BrowserRouter as Router } from "react-router-dom";
import Layout from './components/layout/Layout';
import './style/style.css';

const App: React.FC = () => {
  const theme = createTheme({
    palette: {
      type: 'dark',
    },
  });

  return (
    <Router>
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <CssBaseline />
           <Layout />
        </ThemeProvider>
      </React.Fragment>
    </Router>
  );
}

export default App;
