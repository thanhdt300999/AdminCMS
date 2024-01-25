import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import {useForm} from "react-hook-form";
import {useLogin} from "../../../api/useLogin";
import {setAccessToken} from "../../../utils";
import {toast, ToastContainer} from "react-toastify";

const Login = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const {mutateAsync: loginAdmin} = useLogin()
  const navigate = useNavigate()
  const onSubmit = (value) => {
    loginAdmin(value).then(rs => {
      setAccessToken(rs.token)
      navigate('/dashboard')
      toast('Đăng nhập thành công!')

    }).catch((rs) => {
      console.log(rs)
      toast(rs?.response?.data?.message, {
        type: 'error'
      })
    })
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        {...register('username', {required: 'Tài khoản là bắt buộc'})}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register('password', {required: 'Mật khẩu là bắt buộc'})}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol style={{display: 'flex', justifyContent: 'center'}} xs={12}>
                        <CButton onClick={handleSubmit(onSubmit)} color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
        <ToastContainer/>

      </CContainer>
    </div>
  )
}

export default Login
