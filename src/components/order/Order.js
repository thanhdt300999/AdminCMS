// UserManagement.js
import React, {useEffect, useRef, useState} from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CTableHead,
  CTableRow,
  CTableHeaderCell, CTable, CTableBody, CTableDataCell,
  CInputGroup, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CFormSelect
} from '@coreui/react';
import {useDeleteUser} from "../../api/useDeleteUser";
import {useQueryClient} from "@tanstack/react-query";
import {useGetOrder} from "../../api/useGetOrder";
import ReactPaginate from "react-paginate";
import {useGetProvince} from "../../api/useGetProvince";
import {useGetDistrict} from "../../api/useGetDistrict";
import {useGetWard} from "../../api/useGetWard";
import {TypeBook} from "../product/Product";
import {useChangeOrderStatus} from "../../api/useChangeOrderStatus";
import {toast, ToastContainer} from "react-toastify";

export const PaymentStatus = {
  0: 'Chưa thanh toán',
  1: 'Đã thanh toán'
}
export const TypePayment = {
  ['offline']: 'COD',
  ['online']: 'Online'
}
export const OrderStatus = {
  0: 'Đang chờ giao hàng',
  1: 'Đang giao hàng',
  2: 'Đã nhận',
  3: 'Đã hủy',
  4: 'Không liên hệ được',
  5: 'Hoàn hàng'
}
export const formatCurrency = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
}

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState('')
  const [isView, setIsView] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [orderDetail, setOrderDetail] = useState();
  const [pageSize, setPageSize] = useState(20);
  const [orderStatus, setOrderStatus] = useState(0);
  const {data} = useGetOrder({
    searchTerm,
    pageSize,
    pageNumber
  })
  useEffect(() => {
    setOrderStatus(orderDetail?.status)
  }, [orderDetail]);
  const {mutateAsync: editOrderStatus} = useChangeOrderStatus()
  const queryClient = useQueryClient()
  const [isChanged, setIsChanged] = useState(false);
  const {data: provinceData} = useGetProvince()
  const {data: districtData} = useGetDistrict({province_id: orderDetail?.address?.province})
  const {data: wardData} = useGetWard({district_id: orderDetail?.address?.district})

  const showAddress = () => {
    const province = provinceData?.data?.find(item => item.ProvinceID === Number(orderDetail?.address?.province))
    const district = districtData?.data?.find(item => item.DistrictID === Number(orderDetail?.address?.district))
    const ward = wardData?.data?.find(item => item.WardCode == orderDetail?.address?.ward)

    return `${ward?.WardName || 'N/A'}, ${district?.DistrictName || 'N/A'}, ${province?.ProvinceName || 'N/A'}`

  }
  const handleSearch = () => {
    setSearchTerm(search)
  };
  const handlePageChange = ({selected}) => {
    setPageNumber(selected + 1)
  }

  const handleChangeStatus = (e) => {
    setOrderStatus(e.target.value)
    setIsChanged(true)
  }

  const handleConfirmChangeStatus = () => {
    editOrderStatus({
      orderId: orderDetail?._id,
      status: orderStatus
    }).then(rs => {
      toast('Thay đổi trạng thái sản phẩm thành công!')
      setIsView(false)
      setOrderDetail(undefined)
      setOrderStatus(undefined)
      queryClient.refetchQueries(['get-all-orders'])
    })
  }

  return (
    <div>
      <CCard>
        <CCardHeader>
          <h4>Quản lý đơn hàng</h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <div style={{display: "flex", alignItems: 'center', gap: '0 12px'}}>
                <span>Tìm kiếm theo mã đơn hàng</span>
                <input onChange={(e) => setSearch(e.target.value)} style={{borderRadius: '4px', padding: '4px'}} placeholder="Nhập mã"/>
                <CButton color="primary" onClick={handleSearch}>
                  Search
                </CButton>
              </div>
            </CCol>
          </CRow>
          {isView ? <div>
            <div style={{width: 'fit-content', marginRight: 0, marginLeft: 'auto', display: 'flex', gap: "0 6px"}}>
              <CButton color="warning" onClick={() => {
                setIsView(false)
                setOrderDetail(undefined)
                setIsChanged(false)
              }}>
                <span style={{color: '#ffffff'}}>Quay lại</span>
              </CButton>
              {isChanged ? <CButton color="success" onClick={() => {
                handleConfirmChangeStatus()
              }}>
                <span style={{color: '#ffffff'}}>Xác nhận</span>
              </CButton>: null}
            </div>
            <div style={{marginTop: '12px'}}>
              <div className={'row'}>
                <div className={'col'}>
                  <p style={{marginBottom: 0, fontWeight: 600}}>Mã đơn hàng</p>
                  <p>{orderDetail?._id}</p>
                </div>
                <div className={'col'}>
                  <p style={{marginBottom: 0, fontWeight: 600}}>Trạng thái đơn hàng</p>
                  <CFormSelect
                    aria-label="Default select example"
                    value={orderStatus}
                    onChange={handleChangeStatus}
                    options={[
                      { label: 'Đang chờ giao hàng', value: 0 },
                      { label: 'Đang giao hàng', value: 1 },
                      { label: 'Đã nhận', value: 2 },
                      { label: 'Đã hủy', value: 3},
                      { label: 'Không liên hệ được', value: 4},
                      { label: 'Hoàn hàng', value: 5},
                    ]}
                  />
                </div>
              </div>
              <div className={'row'} style={{marginTop: '4px'}}>
                <div className={'col'}>
                  <p style={{marginBottom: 0, fontWeight: 600}}>Tên người nhận</p>
                  <p>{orderDetail?.firstName + " " + orderDetail?.lastName}</p>
                </div>
                <div className={'col'}>
                  <p style={{marginBottom: 0, fontWeight: 600}}>Địa chỉ</p>
                  <p>{showAddress()}</p>
                </div>
              </div>
              <div className={'row'} style={{marginTop: '4px'}}>
                <div className={'col'}>
                  <p style={{marginBottom: 0, fontWeight: 600}}>Số điện thoại</p>
                  <p>{orderDetail?.phone}</p>
                </div>
                <div className={'col'}>
                  <p style={{marginBottom: 0, fontWeight: 600}}>Loại thanh toán</p>
                  <p>{TypePayment[orderDetail?.typeShip]}</p>
                </div>
              </div>
              <div className={'row'} style={{marginTop: '4px'}}>
                <div className={'col'}>
                  <p style={{marginBottom: 0, fontWeight: 600}}>Ngày đặt hàng</p>
                  <p>{orderDetail?.createdAt}</p>
                </div>
                <div className={'col'}>
                  <p style={{marginBottom: 0, fontWeight: 600}}>Tổng</p>
                  <p>{formatCurrency(orderDetail?.summary?.grandTotal)}</p>
                </div>
              </div>
              <div className={'row'} style={{marginTop: '4px'}}>
                <div className={'col'}>
                  <p style={{marginBottom: 0, fontWeight: 600}}>Phí shíp</p>
                  <p>{formatCurrency(orderDetail?.summary?.shippingFee)}</p>
                </div>
                <div className={'col'}>
                  <span></span>
                </div>
              </div>
              <div className={'row'} style={{marginTop: '4px'}}>
                <p style={{fontWeight: 600, fontSize: '20px', marginBottom: 0}}>Danh sách sản phẩm</p>
                <CTable striped style={{marginTop: '0px'}}>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>ID</CTableHeaderCell>
                      <CTableHeaderCell>Tên</CTableHeaderCell>
                      <CTableHeaderCell>Số lượng</CTableHeaderCell>
                      <CTableHeaderCell>Loại sách</CTableHeaderCell>
                      <CTableHeaderCell>Tác giả</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {orderDetail?.products?.map((product) => (
                      <CTableRow key={product?.product?._id}>
                        <CTableDataCell>{product?.product?._id}</CTableDataCell>
                        <CTableDataCell>{product?.product?.name}</CTableDataCell>
                        <CTableDataCell>{product?.quantity}</CTableDataCell>
                        <CTableDataCell>{TypeBook[product?.product?.type]}</CTableDataCell>
                        <CTableDataCell>{product?.product?.author}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </div>
          </div> : null}

          {!isView ? <CTable striped style={{marginTop: '20px'}}>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Tài khoản</CTableHeaderCell>
                <CTableHeaderCell>Tên</CTableHeaderCell>
                <CTableHeaderCell>Trạng thái đơn hàng</CTableHeaderCell>
                <CTableHeaderCell>Số điện thoại</CTableHeaderCell>
                <CTableHeaderCell style={{textAlign: 'center'}}>Hành động</CTableHeaderCell>

              </CTableRow>
            </CTableHead>

            <CTableBody>
              {data?.orders?.map((order) => (
                <CTableRow key={order._id}>
                  <CTableDataCell>{order._id}</CTableDataCell>
                  <CTableDataCell>{order.user.name}</CTableDataCell>
                  <CTableDataCell>{order.firstName + " " + order.lastName}</CTableDataCell>
                  <CTableDataCell>{OrderStatus[order.status]}</CTableDataCell>
                  <CTableDataCell>{order.phone}</CTableDataCell>
                  <CTableDataCell style={{display: 'flex', gap: '0 8px', justifyContent: 'center'}}>
                    <CButton color="warning" onClick={() => {
                      setIsView(order._id)
                      setOrderDetail(order)
                    }}>
                      Xem
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>: null}
        </CCardBody>
      </CCard>
      <div className={'mt-2'} >
        <ReactPaginate
          nextLabel="Sau >"
          onPageChange={handlePageChange}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={data?.pagination?.totalPages}
          previousLabel="< Trước"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default OrderManagement;
