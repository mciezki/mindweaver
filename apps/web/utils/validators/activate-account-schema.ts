
import i18n from '@/translations/i18n';
import { z } from 'zod';

export const activateAccountSchema = z.object({
    token: z.string()
        .min(1, i18n.t('activate_account.form.token.required'))
});

export type ActivateAccountSchema = z.infer<typeof activateAccountSchema>;