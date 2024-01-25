// docs https://jmango360.atlassian.net/wiki/spaces/B2B/pages/2795077633/APIs+Login+flow#Login-API
import { useMutation } from '@tanstack/react-query'
import {AxiosInstance} from "./useGetUser";
const fetcher = async (params) => {
  const rs = await AxiosInstance.post(`/api/admin/login`, params)
  return rs.data
}

const useLogin = () => {
  const fn = useMutation({
    mutationFn: fetcher,
    retry: false,
  })
  return { ...fn }
}

export { useLogin }
