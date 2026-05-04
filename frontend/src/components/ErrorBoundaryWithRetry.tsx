import React, { Component, ReactNode } from 'react';
import { Box, Button, Typography, Alert, AlertTitle } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorCount: number;
}

/**
 * Enhanced Error Boundary с возможностью retry и fallback UI
 */
export class ErrorBoundaryWithRetry extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Вызываем callback если предоставлен
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Используем кастомный fallback если предоставлен
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Если ошибка повторилась много раз - предлагаем перезагрузить страницу
      const isCritical = this.state.errorCount >= 3;

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            padding: 3
          }}
        >
          <Alert 
            severity={isCritical ? 'error' : 'warning'} 
            sx={{ maxWidth: 600, width: '100%', mb: 2 }}
          >
            <AlertTitle>
              {isCritical ? 'Критическая ошибка' : 'Что-то пошло не так'}
            </AlertTitle>
            
            <Typography variant="body2" gutterBottom>
              {isCritical 
                ? 'Приложение столкнулось с критической ошибкой. Попробуйте перезагрузить страницу.'
                : 'Произошла ошибка при отображении компонента. Попробуйте обновить содержимое.'}
            </Typography>

            {this.state.error && (
              <Typography 
                variant="caption" 
                component="pre" 
                sx={{ 
                  mt: 1, 
                  p: 1, 
                  bgcolor: 'rgba(0,0,0,0.1)', 
                  borderRadius: 1,
                  overflow: 'auto',
                  maxHeight: 100
                }}
              >
                {this.state.error.message}
              </Typography>
            )}
          </Alert>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isCritical && (
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
              >
                Попробовать снова
              </Button>
            )}
            
            <Button
              variant={isCritical ? 'contained' : 'outlined'}
              onClick={this.handleReload}
            >
              Перезагрузить страницу
            </Button>
          </Box>

          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <Box 
              sx={{ 
                mt: 3, 
                maxWidth: 800, 
                width: '100%',
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                overflow: 'auto'
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Stack trace (только в режиме разработки):
              </Typography>
              <Typography 
                variant="caption" 
                component="pre"
                sx={{ fontSize: '0.7rem' }}
              >
                {this.state.errorInfo.componentStack}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWithRetry;

