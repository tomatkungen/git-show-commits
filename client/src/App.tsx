import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { MainView } from './main-view/main-view';
import { GitProvider } from './provider/git.provider';

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
      <GitProvider>
        <MainView />
      </GitProvider>
    </ThemeProvider>
  )
}

export default App
