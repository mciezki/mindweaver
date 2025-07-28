'use client';

import { useLogoutMutation } from '@/hooks/api/private/useLogout';
import { SETTINGS_PATH } from '@/utils/paths';
import { Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
    const { t } = useTranslation();
    const { push } = useRouter();

    const { mutate: logout } = useLogoutMutation();

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                {t('dashboard.title')}
            </Typography>
            <Button variant="outlined" color="secondary" onClick={() => push(SETTINGS_PATH)}>
                {t('dashboard.settings')}
            </Button>
            <Button variant="contained" color="secondary" onClick={() => logout()}>
                {t('dashboard.logout')}
            </Button>
        </Box>
    );
};

export default DashboardPage;