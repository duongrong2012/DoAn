import React from 'react';

import styles from './style.module.scss';
import { ProductCategory } from 'constants/types/category';
import routes from 'constants/routes';
import { Link } from 'react-router-dom';

interface Props {
    categories: ProductCategory[]
}

export default function Category({ categories }: Props) {

    return (
        <div className={`${styles.categoryContainer} column`}>
            <div className='title flex'>Danh mục</div>
            <div className='body-container flex'>
                {categories.map((item) => (
                    <Link key={item._id} className='item-container column center' to={routes.FilterPage({ category: item.slug }).path}>
                        <img alt='' src={item.image} className='item-image' />
                        <div>{item.name}</div>
                    </Link>
                ))}
            </div>
        </div>
    )

}