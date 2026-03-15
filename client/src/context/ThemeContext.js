import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode((prev) => !prev);
    };

    const theme = useMemo(() => createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: '#4F46E5',
                light: '#818CF8',
                dark: '#3730A3',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#F43F5E',
                light: '#FB7185',
                dark: '#E11D48',
                contrastText: '#ffffff',
            },
            background: {
                default: darkMode ? '#0F172A' : '#F8FAFC',
                paper: darkMode ? '#1E293B' : '#ffffff',
            },
            text: {
                primary: darkMode ? '#F8FAFC' : '#0F172A',
                secondary: darkMode ? '#94A3B8' : '#475569',
            },
            divider: darkMode ? 'rgba(148, 163, 184, 0.12)' : 'rgba(226, 232, 240, 0.8)',
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h3: {
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 700,
                letterSpacing: '-0.02em',
            },
            h4: {
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
                letterSpacing: '-0.01em',
            },
            h5: {
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
            },
            h6: {
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
            },
            button: {
                textTransform: 'none',
                fontWeight: 600,
                letterSpacing: '0.01em',
            }
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        padding: '8px 24px',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: darkMode 
                                ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' 
                                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        }
                    },
                    containedPrimary: {
                        background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4338CA 0%, #2563EB 100%)',
                        }
                    }
                }
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        boxShadow: darkMode 
                            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' 
                            : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                        border: darkMode 
                            ? '1px solid rgba(148, 163, 184, 0.1)' 
                            : '1px solid rgba(226, 232, 240, 0.8)',
                        transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    }
                }
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        boxShadow: darkMode 
                            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' 
                            : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: darkMode 
                                ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)' 
                                : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        }
                    }
                }
            }
        }
    }), [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
