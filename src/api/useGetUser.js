import {useQuery} from '@tanstack/react-query'
import axios from "axios";
import {getAccessToken} from "../utils";

export const AxiosInstance = axios.create({
  timeout: 30000,
  baseURL: 'http://localhost:4000',
})
AxiosInstance.interceptors.request.use(function (config) {
  if (config.headers) {
    config.headers.Authorization = `Bearer ` + getAccessToken()
  }
  return config
})
const fetcher = async (params) => {
  const rs = await AxiosInstance.get('/api/admin/get-users', {params})
  return rs.data
}

const useGetUser = (params) => {
  const fn = useQuery(
    {
      queryKey: ['get-all-users', params],
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

export { useGetUser }
