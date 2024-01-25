import {useQuery} from '@tanstack/react-query'
import axios from "axios";
import {AxiosInstance} from "./useGetUser";

const fetcher = async (params) => {
  const rs = await AxiosInstance.get('/api/admin/get-orders', {params})
  return rs.data
}

const useGetOrder = (params) => {
  const fn = useQuery(
    {
      queryKey: ['get-all-orders', params],
      queryFn: () => fetcher({
        ...params
      }),
      retry: false,
      refetchOnWindowFocus: false
    }
  )
  return {
    ...fn,
  }
}

export { useGetOrder }
