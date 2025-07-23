'use client';

import { useLogoutMutation } from '@/hooks/api/private/useLogout';
import { Button, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
    const { t } = useTranslation();

    const { mutate: logout } = useLogoutMutation();

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                {t('dashboard.title')}
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => logout()}>
                {t('dashboard.logout')}
            </Button>
        </Box>
    );
};

export default DashboardPage;