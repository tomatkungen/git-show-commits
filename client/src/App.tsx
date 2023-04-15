import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import './App.css';
import { CommitView } from './commit-view/commit-view';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          '&:hover': {
            opacity: 0.7,
            border: '1px solid #757575'
          },
          border: '1px solid #121212'
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        title: {
          fontSize: '14px'
        },
        subheader: {
          fontSize: '12px'
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          textAlign: 'left',
          fontSize: '12px',
          paddingTop: '0px'
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <CommitView />
    </ThemeProvider>
  )
}

export default App
