import React from 'react';

import useAppSelector from 'hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { CategoryActions } from 'redux/slices/category';
import { ProductActions } from 'redux/slices/product';
import styles from './style.module.scss';
import ProductCarousel from 'components/ProductCarousel';
import Category from 'components/Category';
import BestSellerProducts from 'components/BestSellerProducts';

const HomePage = () => {
  const dispatch = useDispatch()

  const categories = useAppSelector((reduxState) => reduxState.category.categories);

  const topFiveProducts = useAppSelector((reduxState) => reduxState.product.topFiveProducts);

  React.useEffect(() => {
    dispatch(CategoryActions.getCategories())

    dispatch(ProductActions.getProducts({ stateName: "topFiveProducts", limit: 5, page: 1, sort: "totalSold" }))
  }, [dispatch])

  return (
    <div className={`${styles.homePageContainer} column resolution`}>
      <ProductCarousel products={topFiveProducts} />
      <Category categories={categories} />
      <BestSellerProducts />
    </div>
  );
}

export default HomePage;
