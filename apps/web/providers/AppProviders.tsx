'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import customTheme from '@/theme/theme';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/translations/i18n';

const queryClient = new QueryClient();

interface AppProvidersProps {
    children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
    return (
        <ThemeProvider theme={customTheme}>
            <CssBaseline />
            <I18nextProvider i18n={i18n}>
                <QueryClientProvider client={queryClient}>
                    <NotificationProvider>
                        {children}
                    </NotificationProvider>
                </QueryClientProvider>
            </I18nextProvider>
        </ThemeProvider>
    );
}