import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import styles from './style.module.scss';
import { ProductActions } from 'redux/slices/product';
import { Product } from 'constants/types/product';
import useAppSelector from 'hooks/useAppSelector';
import { ProductImage } from 'constants/types/image';
import classNames from 'classnames';
import RatingStar from 'components/RatingStar';
import InputChange from 'components/InputChange';
import { Button } from 'antd';
import ProductDescription from 'components/ProductDescription';
import ProductRating from 'components/ProductRating';
import { RatingActions } from 'redux/slices/rating';
import { ratingListLimit } from '../../constants';
import routes from 'constants/routes';
import { AuthActions } from 'redux/slices/auth';
import { CartActions } from 'redux/slices/cart';
import RatingModal from 'components/RatingModal';

interface State {
  currentImage: string,
  productQuantity: number,
  isRatingModalOpen: boolean,
}

const DetailProduct = () => {
  const dispatch = useDispatch()

  const currentPage = React.useRef(1)

  const { slug } = useParams();

  const [state, setState] = React.useState<State>({
    currentImage: "",
    productQuantity: 1,
    isRatingModalOpen: false,
  })

  const productDetail = useAppSelector((reduxState) => reduxState.product.productDetail);

  const ratingList = useAppSelector((reduxState) => reduxState.rating.ratingList);

  const createRatingLoading = useAppSelector((reduxState) => reduxState.rating.createRatingLoading);

  const user = useAppSelector((reduxState) => reduxState.auth.user);

  React.useEffect(() => {
    dispatch(ProductActions.getProductDetail({ slug: slug as Product["slug"] }))
  }, [dispatch, slug])

  React.useEffect(() => {
    if (productDetail) {
      dispatch(RatingActions.getRating({
        productId: productDetail._id,
        page: currentPage.current,
        limit: ratingListLimit,
      }))
    }
  }, [dispatch, productDetail])

  React.useEffect(() => {
    if (productDetail) setState((prevState) => ({ ...prevState, currentImage: productDetail.images[0].url }))
  }, [productDetail])

  const onClickSmallImage = React.useCallback((item: ProductImage) => () => {
    setState((prevState) => ({ ...prevState, currentImage: item.url }))
  }, [])

  const onClickMoreRating = React.useCallback(() => {
    if (productDetail) {
      dispatch(RatingActions.getRating({
        productId: productDetail._id,
        page: ++currentPage.current,
        limit: ratingListLimit,
      }))
    }
  }, [dispatch, productDetail])

  const ratingNumber = React.useMemo(() => {
    if (productDetail && productDetail.totalRatings > 0) {
      return Math.round(productDetail.totalRatingPoints / productDetail.totalRatings)
    }
    return 0
  }, [productDetail])

  const onChangeBuyNumber = React.useCallback((quantity: number) => {
    if (quantity < 1) return

    if (quantity > (productDetail?.quantity ?? 0)) {
      setState((prevState) => ({ ...prevState, productQuantity: productDetail?.quantity ?? 0 }))
    } else {
      setState((prevState) => ({ ...prevState, productQuantity: quantity }))
    }
  }, [productDetail?.quantity])

  const onClickBuyButton = React.useCallback(() => {
    dispatch(AuthActions.toggleAuthModal())
  }, [dispatch])

  const onClickRaingProduct = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, isRatingModalOpen: true }))
  }, [])

  const onClickAddCartProduct = React.useCallback(() => {
    if (productDetail) {
      dispatch(CartActions.addCartProductList({ product: productDetail._id, quantity: state.productQuantity, isToggleAllert: true }))
    }
  }, [dispatch, productDetail, state.productQuantity])

  const onCancleRatingModal = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, isRatingModalOpen: !prevState.isRatingModalOpen }))
  }, [])

  const onSubmitRating = React.useCallback((rating: number, comment: string) => {
    if (productDetail) {
      dispatch(RatingActions.createRating({
        productId: productDetail._id,
        comment,
        rating,
        callback: (success) => {
          if (success) setState((prevState) => ({ ...prevState, isRatingModalOpen: false }))
        },
      }))
    }
  }, [dispatch, productDetail])

  return (
    <div className={`${styles.detailProductContainer} column resolution`}>
      <div className='flex product-detail'>
        <div className='column product-images'>
          <img alt='' src={state.currentImage} className='product-big-image' />
          <div className='product-small-image-list flex'>
            {productDetail?.images.map((item) => (
              <img
                alt=""
                key={item._id}
                src={item.url}
                onClick={onClickSmallImage(item)}
                className={classNames({
                  'small-image': true,
                  [styles.currentSmallImageBorder]: item.url === state.currentImage
                })}
              />
            ))}
          </div>
        </div>
        <div className='more-product-detail column'>
          <div className='product-name'>{productDetail?.name}</div>
          <div className='flex product-achievements'>
            <div className='flex product-rating-container' onClick={onClickRaingProduct}>
              <div className='product-rating-number'>{ratingNumber}</div>
              <RatingStar ratingNumber={ratingNumber} size={24} />
            </div>
            <div className='product-total-rating'>{productDetail?.totalRatings} Đánh Giá</div>
            <div className='product-total-sold'>{productDetail?.totalSold} Đã Bán</div>
          </div>
          <div className='product-price-container flex'>
            <div className={styles.productLabel}>Giá : </div>
            <div className='đ'>₫</div>
            <div className='product-price'>{productDetail?.price}</div>
          </div>
          <div className='product-quantity flex'>
            <div className={styles.productLabel}>Số Lượng</div>
            <InputChange value={state.productQuantity} onChange={onChangeBuyNumber} />
            <div className='product-available'>{productDetail?.quantity} sản phẩm có sẵn</div>
          </div>
          <div className='buy-product-container flex'>
            <Button className='add-to-cart' onClick={onClickAddCartProduct}>Thêm Vào Giỏ Hàng</Button>
            {user ? (
              <Link to={routes.OrderPage().path} state={{ products: [{ product: productDetail, quantity: state.productQuantity }] }}>
                <Button className='buy'>Mua Ngay</Button>
              </Link>
            ) : (
              <Button className='buy' onClick={onClickBuyButton}>Mua Ngay</Button>
            )}
          </div>
        </div>
      </div>
      <ProductDescription product={productDetail} />
      <ProductRating ratingList={ratingList} onClickMoreRating={onClickMoreRating} />
      <RatingModal
        open={state.isRatingModalOpen}
        oncancel={onCancleRatingModal}
        onSubmitRating={onSubmitRating}
        ratingProductLoading={createRatingLoading}
      />
    </div >
  );
}

export default DetailProduct;
