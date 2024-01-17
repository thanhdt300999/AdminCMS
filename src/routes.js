import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const User = React.lazy(() => import('./components/user/User'))
const Product = React.lazy(() => import('./components/product/Product'))


const routes = [
  {path: '/', exact: true, name: 'Home'},
  {path: '/dashboard', name: 'Dashboard', element: Dashboard},
  {path: '/product', name: 'Product', element: Product},
  {path: '/order', name: 'Order', element: Tables},
  {path: '/user', name: 'User', element: User},
]

export default routes
