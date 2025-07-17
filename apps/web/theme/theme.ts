import { createTheme, darken, lighten } from '@mui/material/styles';

const primaryPurple = '#7e57c2';
const secondaryNavy = '#42a5f5';
const darkBackground = '#121212';
const paperBackground = '#1e1e1e';
const lightText = '#e0e0e0';
const secondaryText = '#bdbdbd';
const errorRed = '#ef5350';
const successGreen = '#66bb6a';
const infoBlue = '#2196f3';
const warningOrange = '#ff9800';

const customTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: primaryPurple,
            light: lighten(primaryPurple, 0.2),
            dark: darken(primaryPurple, 0.2),
            contrastText: lightText,
        },
        secondary: {
            main: secondaryNavy,
            light: lighten(secondaryNavy, 0.2),
            dark: darken(secondaryNavy, 0.2),
            contrastText: lightText,
        },
        background: {
            default: darkBackground,
            paper: paperBackground,
        },
        text: {
            primary: lightText,
            secondary: secondaryText,
        },
        error: {
            main: errorRed,
        },
        success: {
            main: successGreen,
        },
        info: {
            main: infoBlue,
        },
        warning: {
            main: warningOrange,
        },
    },

    typography: {
        fontFamily: [
            'Roboto',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: { fontWeight: 700, fontSize: '3.5rem' },
        h2: { fontWeight: 700, fontSize: '2.5rem' },
        h3: { fontWeight: 600, fontSize: '2rem' },
        h4: { fontWeight: 600, fontSize: '1.75rem', color: primaryPurple },
    },

    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '12px 24px',
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: darken(primaryPurple, 0.1),
                    },
                },
                outlinedPrimary: {
                    borderColor: primaryPurple,
                    color: primaryPurple,
                    '&:hover': {
                        borderColor: lighten(primaryPurple, 0.2),
                        backgroundColor: 'rgba(126, 87, 194, 0.08)',
                    },
                },
                textPrimary: {
                    color: primaryPurple,
                    '&:hover': {
                        backgroundColor: 'rgba(126, 87, 194, 0.08)',
                    },
                },
                containedSecondary: {
                    backgroundColor: secondaryNavy,
                    '&:hover': {
                        backgroundColor: darken(secondaryNavy, 0.1),
                    }
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        backgroundColor: darken(paperBackground, 0.05),
                        '& fieldset': {
                            borderColor: secondaryText,
                        },
                        '&:hover fieldset': {
                            borderColor: primaryPurple,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: primaryPurple,
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: secondaryText,
                        '&.Mui-focused': {
                            color: primaryPurple,
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: lightText,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    backgroundColor: paperBackground,
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: secondaryNavy,
                    textDecoration: 'none',
                    '&:hover': {
                        textDecoration: 'underline',
                        color: lighten(secondaryNavy, 0.1),
                    },
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        backgroundColor: darken(paperBackground, 0.05),
                        '& fieldset': {
                            borderColor: secondaryText,
                        },
                        '&:hover fieldset': {
                            borderColor: primaryPurple,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: primaryPurple,
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: secondaryText,
                        '&.Mui-focused': {
                            color: primaryPurple,
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: lightText,
                    },
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    backgroundColor: paperBackground,
                    color: lightText,
                    '&:hover': {
                        backgroundColor: darken(paperBackground, 0.1),
                    },
                    '&.Mui-selected': {
                        backgroundColor: lighten(paperBackground, 0.05),
                        color: primaryPurple,
                    }
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: 8, // Zaokrąglone rogi dla alertów
                    padding: theme.spacing(1.5, 2), // Większy padding
                    alignItems: 'center', // Wyśrodkowanie zawartości
                }),
                // Styles dla różnych wariantów (severity)
                standardSuccess: ({ theme }) => ({
                    backgroundColor: darken(theme.palette.success.main, 0.8), // Ciemne tło oparte na sukcesie
                    color: theme.palette.success.light, // Jasny tekst
                    '& .MuiAlert-icon': {
                        color: theme.palette.success.main, // Kolor ikony zgodny z głównym kolorem severity
                    },
                    '& .MuiAlert-message': {
                        color: theme.palette.success.light, // Jasny kolor wiadomości
                    },
                    '& .MuiAlert-action': {
                        color: theme.palette.success.main, // Kolor akcji (np. przycisk zamknij)
                    },
                }),
                standardInfo: ({ theme }) => ({
                    backgroundColor: darken(theme.palette.info.main, 0.8),
                    color: theme.palette.info.light,
                    '& .MuiAlert-icon': {
                        color: theme.palette.info.main,
                    },
                    '& .MuiAlert-message': {
                        color: theme.palette.info.light,
                    },
                    '& .MuiAlert-action': {
                        color: theme.palette.info.main,
                    },
                }),
                standardWarning: ({ theme }) => ({
                    backgroundColor: darken(theme.palette.warning.main, 0.8),
                    color: theme.palette.warning.light,
                    '& .MuiAlert-icon': {
                        color: theme.palette.warning.main,
                    },
                    '& .MuiAlert-message': {
                        color: theme.palette.warning.light,
                    },
                    '& .MuiAlert-action': {
                        color: theme.palette.warning.main,
                    },
                }),
                standardError: ({ theme }) => ({
                    backgroundColor: darken(theme.palette.error.main, 0.8),
                    color: theme.palette.error.light,
                    '& .MuiAlert-icon': {
                        color: theme.palette.error.main,
                    },
                    '& .MuiAlert-message': {
                        color: theme.palette.error.light,
                    },
                    '& .MuiAlert-action': {
                        color: theme.palette.error.main,
                    },
                }),
                filledSuccess: ({ theme }) => ({
                    backgroundColor: theme.palette.success.main,
                    color: theme.palette.success.contrastText || lightText,
                }),
                filledInfo: ({ theme }) => ({
                    backgroundColor: theme.palette.info.main,
                    color: theme.palette.info.contrastText || lightText,
                }),
                filledWarning: ({ theme }) => ({
                    backgroundColor: theme.palette.warning.main,
                    color: theme.palette.warning.contrastText || lightText,
                }),
                filledError: ({ theme }) => ({
                    backgroundColor: theme.palette.error.main,
                    color: theme.palette.error.contrastText || lightText,
                }),
            },
        },
    },
});

export default customTheme;