import { AuthResponse, LoginRequest } from '@mindweave/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useNotification } from '@/contexts/NotificationContext';

import { post } from '@/utils/api/apiClients';
import { PUBLIC_API } from '@/utils/api/apiPaths';
import { DASHBOARD_PATH } from '@/utils/paths';

export const useLoginMutation = () => {
  const { showNotification } = useNotification();
  const { push } = useRouter();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (data: LoginRequest) => {
      const response = await post<AuthResponse, LoginRequest>(
        PUBLIC_API.login,
        data,
      );
      return response;
    },
    onSuccess: (data) => {
      showNotification((data as any)?.message || '', 'success');
      push(DASHBOARD_PATH);
    },
    onError: (error) => {
      const apiErrorMessage = (error as any)?.response?.data?.message;
      if (apiErrorMessage) {
        showNotification(apiErrorMessage, 'error');
      }
    },
  });
};
