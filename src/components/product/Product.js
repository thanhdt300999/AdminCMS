// UserManagement.js
import React, {useEffect, useState} from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination
} from '@coreui/react';
import ReactPaginate from 'react-paginate';
import './index.css'
import {useQueryClient} from "@tanstack/react-query";
import {useGetProduct} from "../../api/useGetAllProduct";
import Form from 'react-bootstrap/Form';
import {useForm} from "react-hook-form";
import {useCreateProduct} from "../../api/useCreateProduct";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useEditProduct} from "../../api/useEditProduct";
import {useDeleteProduct} from "../../api/useDeleteProduct";

export const TypeBook = {
  ['sach-nghe-thuat']: 'Sách nghệ thuật',
  ['sach-van-phong']: 'Sách văn phòng',
  ['sach-van-hoc']: 'Sách văn học',
  ['sach-tin-hoc']: 'Sách tin học',
  ['sach-khoa-hoc']: 'Sách khoa học',
  ['sach-giao-khoa']: 'Sách giáo khoa',
  ['truyen-tranh']: 'Truyện tranh',
  ['sach-thieu-nhi']: 'Sách thiếu nhi',
  ['sach-kinh-te']: 'Sách kinh tế',
}
export const TypeBook1 = [
  { value: 'Sách nghệ thuật',
    code: 'sach-nghe-thuat'
  },
  { value: 'Sách văn phòng',
    code: 'sach-van-phong'
  },
  { value: 'Sách văn học',
    code: 'sach-van-hoc'
  },
  { value: 'Sách khoa học',
    code: 'sach-khoa-hoc'
  },
  { value: 'Sách giáo khoa',
    code: 'sach-giao-khoa'
  },
  { value: 'Truyện tranh',
    code: 'truyen-tranh'
  },
  {
    value: 'Sách thiếu nhi',
    code: 'sach-thieu-nhi'
  },
  {
    value: 'Sách kinh tế',
    code: 'sach-kinh-te'
  },
  {
    value: 'Sách tin học',
    code: 'sach-tin-hoc'
  },
]

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState(undefined);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState('')
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [salePrice, setSalePrice] = useState(0);
  const [salePercent, setSalePercent] = useState(0);
  const [selectedFile, setSelectedFile] = useState();
  const [price, setPrice] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm()

  const {mutateAsync: createProduct} = useCreateProduct()
  const {mutateAsync: editProduct} = useEditProduct()
  const {mutateAsync: deleteProduct} = useDeleteProduct()

  const {data} = useGetProduct({
    searchTerm,
    pageSize,
    pageNumber
  })
  const onSubmit = value => {
    const newFormData = {
      ...value,
      salePrice: salePrice
    }
    const dataSend = new FormData()
    dataSend.append('data', JSON.stringify(newFormData))
    dataSend.append('image', selectedFile)
    if (isAdd) {
      createProduct(dataSend).then(rs => {
        toast('Thêm sản phẩm thành công!')
        resetForm()
        queryClient.refetchQueries(['get-all-products'])
      }).catch((e) => {
        toast(e.message)
      })
    }
    if (isEdit) {
      editProduct({productId: isEdit, dataSend}).then(rs => {
        toast('Chỉnh sửa sản phẩm thành công!')
        resetForm()
        queryClient.refetchQueries(['get-all-products'])

      }).catch((e) => {
        toast(e.message)
      })
    }

  }
  const resetForm = () => {
    reset()
    setSalePrice(0)
    setPrice(0)
    setSalePercent(0)
    setSelectedFile(null)
    setIsAdd(false)
    setIsEdit(false)
  }
  const queryClient = useQueryClient()
  const handleSearch = () => {
    setSearchTerm(search)
  };
  const handleDelete = (_id) => {
    setVisible(_id)
  };
  const handleEdit = (_id) => {
    setIsEdit(_id)
  };
  const handlePageChange = ({selected}) => {
    setPageNumber(selected + 1)
  }
  const handleAddProduct = () => {
    setIsAdd(true)
  }
  const handleBack = () => {
    setIsAdd(false)
    setIsEdit(false)
    resetForm()
  }
  const handleConfirmDelete = () => {
    deleteProduct({productId: visible}).then((rs) => {
      setVisible('')
      toast('Xoá sản phẩm thành công!')
      queryClient.refetchQueries(['get-all-products'])
    })
  };

  useEffect(() => {
    setSalePrice((price * (100 - salePercent) / 100).toFixed(0))
  },[price, salePercent])

  useEffect(() => {
    if (isEdit) {
      const productDetail = data?.products?.find(item => item._id === isEdit)
      setValue('price', productDetail?.price)
      setValue('name', productDetail?.name)
      setValue('type', productDetail?.type)
      setValue('stock', productDetail?.stock)
      setValue('author', productDetail?.author)
      setValue('description', productDetail?.description)
    }
  }, [isEdit, data?.products]);


  return (
    <div>
      <CCard>
        <CCardHeader>
          <h4>{isAdd ? 'Thêm mới sản phẩm' : isEdit ? 'Chỉnh sửa sản phẩm' : 'Quản lý sản phẩm'}</h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <div style={{display: "flex", alignItems: 'center', justifyContent: `${(!isAdd && !isEdit) ? 'space-between' : 'flex-end'}`}}>
                {!isAdd && !isEdit && <div style={{display: "flex", alignItems: 'center', gap: '0 12px'}}>
                  <span>Tìm kiếm theo tên sản phẩm</span>
                  <input onChange={(e) => setSearch(e.target.value)} style={{borderRadius: '4px', padding: '4px'}}
                         placeholder="Nhập tên"/>
                  <CButton color="primary" onClick={handleSearch}>
                    Search
                  </CButton>
                </div>}
                <div style={{display: "flex", gap: '0 8px'}}>
                  {!isAdd && !isEdit && <CButton color="success" onClick={handleAddProduct}>
                    <span style={{color: '#ffffff'}}>Thêm sản phẩm</span>
                  </CButton>}
                  {isAdd && <CButton color="primary" onClick={handleBack}>
                    <span style={{color: '#ffffff'}}>Quay lại</span>
                  </CButton>}
                  {isEdit && <CButton color="primary" onClick={handleBack}>
                    <span style={{color: '#ffffff'}}>Quay lại</span>
                  </CButton>}
                  {(isEdit || isAdd) ? <CButton color="success" onClick={handleSubmit(onSubmit)}>
                    <span style={{color: '#ffffff'}}>Xác nhận</span>
                  </CButton> : null}
                </div>
              </div>
            </CCol>
          </CRow>
          {isAdd &&
            <div style={{marginTop: '16px'}}>
              <Form>
                <Form.Group  controlId="formBasicEmail">
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control
                    {...register("image", {
                      onChange: (e) => {
                        setSelectedFile(e.target.files[0])
                      }
                    })} type="file" placeholder="Chọn ảnh" />
                </Form.Group>

                <Form.Group  controlId="formBasicEmail">
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control
                    {...register("name", {
                    required: {
                      value: true,
                      message: "Trường này là bắt buộc"
                    }
                  })} type="text" placeholder="Nhập tên sản phẩm" />
                </Form.Group>
                {errors?.name && <p style={{color: 'red'}}>{errors?.name?.message}</p>}
                <Form.Group  controlId="formBasicPassword">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control {...register("price", {
                    required: {
                      value: true,
                      message: "Trường này là bắt buộc"
                    },
                    onChange: (e) => {
                      setPrice(e.target.value)
                    },
                    min: 0
                  })} type="number" placeholder="Nhập giá sản phẩm" />
                </Form.Group>
                {errors?.price && <p style={{color: 'red'}}>{errors?.price?.message}</p>}

                <Form.Group  controlId="formBasicPassword">
                  <Form.Label>Giảm giá(%)</Form.Label>
                  <Form.Control {...register("salePercent", {
                    onChange: (e) => {
                      setSalePercent(e.target.value)
                    },
                    max: 100,
                    min: 0
                  })} type="text" placeholder="Nhập % giảm giá" />
                </Form.Group>
                {errors?.salePercent && <p style={{color: 'red'}}>{errors?.salePercent?.message}</p>}

                <Form.Group  controlId="formBasicPassword">
                  <Form.Label>Giá sau khi giảm</Form.Label>
                  <Form.Control value={salePrice} disabled type="text"/>
                </Form.Group>
                {errors?.salePrice && <p style={{color: 'red'}}>{errors?.salePrice?.message}</p>}

                <Form.Group  controlId="formBasicPassword">
                  <Form.Label>Loại sản phẩm</Form.Label>
                  <Form.Select
                    {...register("type", {
                      required: {
                        value: true,
                        message: "Trường này là bắt buộc"
                      },
                      onChange: (value) => {
                        console.log(value)
                      },
                      max: 100,
                      min: 0
                    })}
                  >
                    <option value=""></option>
                    {TypeBook1.map(item => {
                      return <option value={item.code}>{item.value}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                {errors?.type && <p style={{color: 'red'}}>{errors?.type?.message}</p>}

                <Form.Group  controlId="formBasicPassword">
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control {...register("stock", {
                    required: {
                      value: true,
                      message: "Trường này là bắt buộc"
                    },
                  })} type="text" placeholder="Nhập số lượng sản phẩm" />
                </Form.Group>
                {errors?.stock && <p style={{color: 'red'}}>{errors?.stock?.message}</p>}

                <Form.Group  controlId="formBasicPassword">
                  <Form.Label>Tác giả</Form.Label>
                  <Form.Control {...register("author", {
                    required: {
                      value: true,
                      message: "Trường này là bắt buộc"
                    },
                  })} type="text" placeholder="Nhập tên tác giả" />
                </Form.Group>
                {errors?.author && <p style={{color: 'red'}}>{errors?.author?.message}</p>}

                <Form.Group  controlId="formBasicPassword">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control {...register("description", {
                  })} type="text" placeholder="Nhập mô tả sản phẩm" />
                </Form.Group>
              </Form>
            </div>
          }
          {isEdit &&
            <div style={{marginTop: '16px'}}>
              <Form>
                <Form.Group  controlId="formBasicEmail">
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control
                    {...register("image", {
                      onChange: (e) => {
                        setSelectedFile(e.target.files[0])
                      }
                    })} type="file" placeholder="Chọn ảnh" />
                </Form.Group>

                <Form.Group  controlId="formBasicEmail">
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control
                    {...register("name", {
                      required: {
                        value: true,
                        message: "Trường này là bắt buộc"
                      }
                    })} type="text" placeholder="Nhập tên sản phẩm" />
                </Form.Group>
                {errors?.name && <p style={{color: 'red'}}>{errors?.name?.message}</p>}
                <Form.Group  controlId="formBasicPassword">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control {...register("price", {
                    required: {
                      value: true,
                      message: "Trường này là bắt buộc"
                    },
                    onChange: (e) => {
                      setPrice(e.target.value)
                    },
                    min: 0
                  })} type="number" placeholder="Nhập giá sản phẩm" />
                </Form.Group>
                {errors?.price && <p style={{color: 'red'}}>{errors?.price?.message}</p>}

                <Form.Group  controlId="formBasicPassword">
                  <Form.Label>Giảm giá(%)</Form.Label>
                  <Form.Control {...register("salePercent", {
                    onChange: (e) => {
                      setSalePercent(e.target.value)
                    },
                    max: 100,
                    min: 0
                  })} type="text" placeholder="Nhập % giảm giá" />
                </Form.Group>
                {errors?.salePercent && <p style={{color: 'red'}}>{errors?.salePercent?.message}</p>}

                <Form.Group  controlId="formBasicPassword">
                  <Form.Label>Giá sau khi giảm</Form.Label>
                  <Form.Control value={salePrice} disabled type="text"/>
                </Form.Group>
                {errors?.salePrice && <p style={{color: 'red'}}>{errors?.salePrice?.message}</p>}

                <Form.Group  controlId="formBasicPassword">
                  <Form.Label>Loại sản phẩm</Form.Label>
                  <Form.Select
                    {...register("type", {
                      required: {
                        value: true,
                        message: "Trường này là bắt buộc"
                      },
                      onChange: (value) => {
                        console.log(value)
                      },
                      max: 100,
                      min: 0
                    })}
                  >
                    <option value=""></option>
                    {TypeBook1.map(item => {
                      return <option value={item.code}>{item.value}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                {errors?.type && <p style={{color: 'red'}}>{errors?.type?.message}</p>}

                <Form.Group  controlId="formBasicPassword">
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control {...register("stock", {
                    required: {
                      value: true,
                      message: "Trường này là bắt buộc"
                    },
                  })} type="text" placeholder="Nhập số lượng sản phẩm" />
                </Form.Group>
                {errors?.stock && <p style={{color: 'red'}}>{errors?.stock?.message}</p>}

                <Form.Group  controlId="formBasicPassword">
                  <Form.Label>Tác giả</Form.Label>
                  <Form.Control {...register("author", {
                    required: {
                      value: true,
                      message: "Trường này là bắt buộc"
                    },
                  })} type="text" placeholder="Nhập tên tác giả" />
                </Form.Group>
                {errors?.author && <p style={{color: 'red'}}>{errors?.author?.message}</p>}

                <Form.Group  controlId="formBasicPassword">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control {...register("description", {
                  })} type="text" placeholder="Nhập mô tả sản phẩm" />
                </Form.Group>
              </Form>
            </div>
          }
          {!isAdd && !isEdit &&
            <><CTable striped style={{marginTop: '20px'}}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Tên</CTableHeaderCell>
                  <CTableHeaderCell>Số lượng</CTableHeaderCell>
                  <CTableHeaderCell>Loại sách</CTableHeaderCell>
                  <CTableHeaderCell>Tác giả</CTableHeaderCell>
                  <CTableHeaderCell style={{textAlign: 'center'}}>Hành động</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data?.products?.map((user) => (
                  <CTableRow key={user?._id}>
                    <CTableDataCell>{user?._id}</CTableDataCell>
                    <CTableDataCell>{user?.name}</CTableDataCell>
                    <CTableDataCell>{user?.stock}</CTableDataCell>
                    <CTableDataCell>{TypeBook[user?.type]}</CTableDataCell>
                    <CTableDataCell>{user?.author}</CTableDataCell>

                    <CTableDataCell style={{textAlign: 'center', display: 'flex', gap: '0 4px'}}>
                      <CButton color="warning" onClick={() => handleEdit(user._id)}>
                        Sửa
                      </CButton>
                      <CButton color="danger" onClick={() => handleDelete(user._id)}>
                        Xoá
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
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

            </>
          }
        </CCardBody>
      </CCard>

      <CModal
        visible={!!visible}
        onClose={() => setVisible('')}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => setVisible('')}>
          <CModalTitle id="LiveDemoExampleLabel">Xóa sản phẩm</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Bạn có muốn xóa người sản phẩm này?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible('')}>
            Không
          </CButton>
          <CButton color="primary" onClick={handleConfirmDelete}>Xác nhận</CButton>
        </CModalFooter>
      </CModal>
      <ToastContainer />
    </div>
  );
};

export default ProductManagement;
