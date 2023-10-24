import React from 'react';

import styles from './style.module.scss';
import { Link } from 'react-router-dom';
import routes from 'constants/routes';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { ProductActions } from 'redux/slices/product';
import useAppSelector from 'hooks/useAppSelector';


export default function BestSellerProducts() {
    const dispatch = useDispatch()

    const currentPage = React.useRef(1)

    const topSoldProductsLimit = React.useRef(30)

    const topSoldProducts = useAppSelector((reduxState) => reduxState.product.topSoldProducts);

    const isShowLoadButton = React.useMemo(() => (
        topSoldProducts.length % topSoldProductsLimit.current === 0 && topSoldProducts.length > 0
    ), [topSoldProducts.length])

    React.useEffect(() => {
        dispatch(ProductActions.getProducts({
            stateName: "topSoldProducts",
            limit: topSoldProductsLimit.current,
            page: currentPage.current,
            sort: "totalSold"
        }))
    }, [dispatch])

    const onClickLoadMore = React.useCallback(() => {
        dispatch(ProductActions.getProducts({
            stateName: "topSoldProducts",
            limit: topSoldProductsLimit.current,
            page: ++currentPage.current,
            sort: "totalSold"
        }))
    }, [dispatch])

    return (
        <div className={`${styles.bestSellerProductsContainer}`}>
            <div className='resolution column'>
                <div className='title'>Sản Phẩm Bán Chạy</div>
                <div className='body-container flex'>
                    {topSoldProducts.map((item) => (
                        <Link className='item-container column' to={routes.ProductDetail(item.slug).path}>
                            <img className='item-image' alt="" src={item.images[0].url} />
                            <div className='item-infor-container column'>
                                <div className='item-name long-content'>{item.name}</div>
                                <div className='flex item-detail center'>
                                    <div className='item-price'>đ{item.price}</div>
                                    <div className='total-item-sold'>đ{item.totalSold}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                {isShowLoadButton && (
                    <div className='center more-comment' onClick={onClickLoadMore}>
                        <Button size="large" className='commentBut'>
                            Xem thêm sản phẩm
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )

}