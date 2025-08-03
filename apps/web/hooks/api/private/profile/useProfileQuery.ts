'use client';

import { User } from '@mindweave/types';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { PROFILE_KEY } from '@/hooks/api/apiKeys';

import { get } from '@/utils/api/apiClients';
import { PRIVATE_API } from '@/utils/api/apiPaths';

interface UserRequest {
  message: string;
  profile: User;
}

export const useProfileQuery = (
  options?: UseQueryOptions<UserRequest | null, AxiosError>,
) => {
  const query = useQuery<UserRequest | null, AxiosError>({
    queryKey: [PROFILE_KEY],
    queryFn: async () => await get(PRIVATE_API.profile),
    ...options,
  });

  return { ...query, data: query.data?.profile };
};
