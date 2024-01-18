import {useQuery} from '@tanstack/react-query'
import {AxiosInstance} from "./useGetUser";

const fetcher = async (params) => {
  const rs = await AxiosInstance.get('/api/cart/province', { params })
  return rs.data
}

const useGetProvince = (params) => {

  const fn = useQuery(
    {
      queryKey: ['get-province'],
      queryFn: () => fetcher({
        ...params,
      }),
      refetchOnWindowFocus: false,
    }
  )
  return {
    ...fn,
  }
}

export { useGetProvince }
