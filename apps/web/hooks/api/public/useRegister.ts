import { useMutation } from '@tanstack/react-query';
import { post } from '@/utils/api/apiClients';
import { AuthResponse, RegisterRequest } from '@mindweave/types';
import { useNotification } from '@/contexts/NotificationContext';
import { PUBLIC_API } from '@/utils/api/apiPaths';


export const useRegisterMutation = () => {
    const { showNotification } = useNotification();

    return useMutation<AuthResponse, Error, RegisterRequest>({
        mutationFn: async (data: RegisterRequest) => {
            const response = await post<AuthResponse, RegisterRequest>(PUBLIC_API.register, data);
            return response;
        },
        onSuccess: (data) => {
            showNotification((data as any)?.message || 'Registration completed.', 'success');
        },
        onError: (error) => {
            const apiErrorMessage = (error as any)?.response?.data?.message;
            if (apiErrorMessage) {
                showNotification(apiErrorMessage, 'error');
            }
        },
    });
};