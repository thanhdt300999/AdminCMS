import {useQuery} from '@tanstack/react-query'
import {AxiosInstance} from "./useGetUser";

const fetcher = async (params) => {
  const rs = await AxiosInstance.get('/api/cart/district', { params })
  return rs.data
}

const useGetDistrict = (params)  => {

  const fn = useQuery(
    {
      queryKey: ['get-district', params?.province_id],
      queryFn: () => {
        return fetcher(params)
      },
      enabled: !!params?.province_id,
      refetchOnWindowFocus: false
    }
  )
  return {
    ...fn,
  }
}

export { useGetDistrict }
