import { useMutation } from '@tanstack/react-query';
import { post } from '@/utils/api/apiClients';
import { ForgotPasswordSchema } from '@/utils/validators/forgot-password-schema';
import { PUBLIC_API } from '@/utils/api/apiPaths';
import { useNotification } from '@/contexts/NotificationContext';
import { useRouter } from 'next/navigation';
import { RESET_PASSWORD_PATH } from '@/utils/paths';

interface ForgotPasswordApiResponse {
    message: string;
}

export const useForgotPasswordMutation = () => {
    const { showNotification } = useNotification();
    const { push } = useRouter()
    return useMutation<ForgotPasswordApiResponse, Error, ForgotPasswordSchema>({
        mutationFn: async (data: ForgotPasswordSchema) => {
            const response = await post<ForgotPasswordApiResponse, ForgotPasswordSchema>(PUBLIC_API.request_password_reset, data);
            return response;
        },
        onSuccess: (data) => {
            showNotification(data.message, 'success');
            push(RESET_PASSWORD_PATH)
        },
        onError: (error) => {
            const apiErrorMessage = (error as any)?.response?.data?.message;
            if (apiErrorMessage) {
                showNotification(apiErrorMessage, 'error');
            }
        },
    });
};