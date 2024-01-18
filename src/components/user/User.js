// UserManagement.js
import React, {useRef, useState} from 'react';
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
} from '@coreui/react';
import {useGetUser} from "../../api/useGetUser";
import {useDeleteUser} from "../../api/useDeleteUser";
import {useQueryClient} from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState('')
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const {data} = useGetUser({
    searchTerm,
    pageSize,
    pageNumber
  })
  const {mutateAsync} = useDeleteUser()
  const queryClient = useQueryClient()


  const handlePageChange = ({selected}) => {
    setPageNumber(selected + 1)
  }
  const handleSearch = () => {
    setSearchTerm(search)
  };
  const handleDelete = (_id) => {
    setVisible(_id)
  };
  const handleConfirmDelete = (_id) => {
    mutateAsync({userId: visible}).then((rs) => {
      setVisible('')
      queryClient.refetchQueries(['get-all-users'])
    })
  };

  return (
    <div>
      <CCard>
        <CCardHeader>
          <h4>Quản lý người dùng</h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <div style={{display: "flex", alignItems: 'center', gap: '0 12px'}}>
                <span>Tìm kiếm theo tên</span>
                <input onChange={(e) => setSearch(e.target.value)} style={{borderRadius: '4px', padding: '4px'}} placeholder="Nhập tên"/>
                <CButton color="primary" onClick={handleSearch}>
                  Search
                </CButton>
              </div>
            </CCol>
          </CRow>
          {/* Hiển thị danh sách người dùng và thông tin quản lý tài khoản ở đây */}
          <CTable striped style={{marginTop: '20px'}}>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Tên</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>

              </CTableRow>
            </CTableHead>
            <CTableBody>
              {data?.user?.map((user) => (
                <CTableRow key={user._id}>
                  <CTableDataCell>{user._id}</CTableDataCell>
                  <CTableDataCell>{user.name}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="warning" onClick={() => handleDelete(user._id)}>
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
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
      <CModal
        visible={!!visible}
        onClose={() => setVisible('')}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => setVisible('')}>
          <CModalTitle id="LiveDemoExampleLabel">Xóa người dùng</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Bạn có muốn xóa người dùng này?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible('')}>
            Không
          </CButton>
          <CButton color="primary" onClick={handleConfirmDelete}>Xác nhận</CButton>
        </CModalFooter>
      </CModal>

    </div>
  );
};

export default UserManagement;
