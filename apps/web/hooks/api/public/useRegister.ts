import { AuthResponse, RegisterRequest } from '@mindweave/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useNotification } from '@/contexts/NotificationContext';

import { post } from '@/utils/api/apiClients';
import { PUBLIC_API } from '@/utils/api/apiPaths';
import { ACTIVATE_ACCOUNT_PATH } from '@/utils/paths';

export const useRegisterMutation = () => {
  const { showNotification } = useNotification();
  const { push } = useRouter();

  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: async (data: RegisterRequest) => {
      const response = await post<AuthResponse, RegisterRequest>(
        PUBLIC_API.register,
        data,
      );
      return response;
    },
    onSuccess: (data) => {
      showNotification((data as any)?.message || '', 'success');
      push(ACTIVATE_ACCOUNT_PATH);
    },
    onError: (error) => {
      const apiErrorMessage = (error as any)?.response?.data?.message;
      if (apiErrorMessage) {
        showNotification(apiErrorMessage, 'error');
      }
    },
  });
};
