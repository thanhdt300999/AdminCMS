// docs https://jmango360.atlassian.net/wiki/spaces/B2B/pages/2795077633/APIs+Login+flow#Login-API
import { useMutation } from '@tanstack/react-query'
import {AxiosInstance} from "./useGetUser";
import axios from "axios";
const fetcher = async (params) => {
  const rs = await AxiosInstance.put(`/api/admin/edit-product?productId=${params.productId}`, params.dataSend , {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
  return rs.data
}

const useEditProduct = () => {
  const fn = useMutation({
    mutationFn: fetcher,
    retry: false,
  })
  return { ...fn }
}

export { useEditProduct }
