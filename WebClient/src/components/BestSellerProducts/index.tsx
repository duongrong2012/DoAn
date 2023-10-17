import React from 'react';

import styles from './style.module.scss';
import { Product } from 'constants/types/product';
import { Link } from 'react-router-dom';
import routes from 'constants/routes';

interface Props {
    products: Product[]
}

export default function BestSellerProducts({ products }: Props) {

    return (
        <div className={`${styles.bestSellerProductsContainer}`}>
            <div className='resolution column'>
                <div className='title'>Sản Phẩm Bán Chạy</div>
                <div className='body-container flex'>
                    {products.map((item) => (
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
            </div>
        </div>
    )

}