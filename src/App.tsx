import { createBrowserRouter } from 'react-router-dom';

import { Layout } from './components/layout';
import { Home } from './pages/home';
import DetailProperty from './pages/detailProperty';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Dashboard } from './pages/dashboard';
import { New } from './pages/dashboard/new';
import { Private } from './routes/Private';
import { Search } from './pages/search';

export const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/imovel/:id",
        element: <DetailProperty/>
      },
      {
        path: "/busca/:search",
        element: <Search/>
      },
      {
        path: "/dashboard",
        element: <Private><Dashboard/></Private>
      },
      {
        path: "/dashboard/novo",
        element: <Private><New/></Private>
      },
    ]
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/registrar",
    element: <Register/>
  },
]);