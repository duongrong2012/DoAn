import HomePage from 'pages/Home';
import LoginPage from 'pages/Login';
import { Product } from './types/product';
import { FilterPageParams } from './types';
import DetailProduct from 'pages/DetailProduct';

const routes = {
  Home: () => ({
    path: '/',
    Component: HomePage,
  }),
  Login: () => ({
    path: '/login',
    Component: LoginPage,
  }),
  ProductDetail: (slug?: Product["slug"]) => {
    let path = '/san-pham/:slug'

    if (slug) {
      path = `/san-pham/${slug}`
    }

    return {
      path,
      exact: true,
      Component: DetailProduct
    }
  },
  FilterPage: (filter: FilterPageParams = {}) => {
    let path = '/bo-loc'

    const searchParams = new URLSearchParams()

    const keys = Object.keys(filter)

    if (keys.length) {
      keys.forEach((key) => {
        const filterKey = key as keyof typeof filter

        if (filter[filterKey]) {
          searchParams.set(key, filter[filterKey] as string)
        }
      })

      path = `${path}?${searchParams.toString()}`
    }

    return {
      path,
      exact: true,
      Component: HomePage
    }
  },
}

export default routes;
