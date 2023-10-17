import React from 'react';
import { Link } from 'react-router-dom';

import useAppSelector from 'hooks/useAppSelector';
import { useDispatch, useSelector } from 'react-redux';
import { AppActions } from 'redux/slices/app';
import { CategoryActions } from 'redux/slices/category';
import { ProductActions } from 'redux/slices/product';
import styles from './style.module.scss';
import ProductCarousel from 'components/ProductCarousel';
import { ReduxState } from 'redux/store';
import Category from 'components/Category';
import BestSellerProducts from 'components/BestSellerProducts';

const HomePage = () => {
  const dispatch = useDispatch()

  const categories = useAppSelector((reduxState) => reduxState.category.categories);

  const topFiveProducts = useAppSelector((reduxState) => reduxState.product.topFiveProducts);

  React.useEffect(() => {
    dispatch(CategoryActions.getCategories())

    dispatch(ProductActions.getProducts({ stateName: "topFiveProducts", limit: 5, page: 1, sort: "totalSold" }))
  }, [])


  return (
    <div className={`${styles.homePageContainer} column resolution`}>
      <ProductCarousel products={topFiveProducts} />
      <Category categories={categories} />
      <BestSellerProducts products={topFiveProducts} />
    </div>
  );
}

export default HomePage;
