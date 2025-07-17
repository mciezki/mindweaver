'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import customTheme from '@/theme/theme';
import { NotificationProvider } from '@/contexts/NotificationContext';

const queryClient = new QueryClient();

interface AppProvidersProps {
    children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
    return (
        <ThemeProvider theme={customTheme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}