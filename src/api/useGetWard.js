import {useQuery} from '@tanstack/react-query'
import {AxiosInstance} from "./useGetUser";

const fetcher = async (params) => {
  const rs = await AxiosInstance.get('/api/cart/ward', { params })
  return rs.data
}

const useGetWard = (params) => {
  const fn = useQuery(
    {
      queryKey: ['get-ward', params?.district_id],
      queryFn: () => fetcher({
        ...params,
      }),
      enabled: !!params?.district_id,
      refetchOnWindowFocus: false
    }
  )
  return {
    ...fn,
  }
}

export { useGetWard }
