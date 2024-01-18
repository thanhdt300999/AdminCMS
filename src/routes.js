import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const User = React.lazy(() => import('./components/user/User'))
const Product = React.lazy(() => import('./components/product/Product'))
const Order = React.lazy(() => import('./components/order/Order'))


const routes = [
  {path: '/', exact: true, name: 'Home'},
  {path: '/dashboard', name: 'Dashboard', element: Dashboard},
  {path: '/product', name: 'Product', element: Product},
  {path: '/order', name: 'Order', element: Order},
  {path: '/user', name: 'User', element: User},
]

export default routes
