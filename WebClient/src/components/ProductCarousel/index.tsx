import React from 'react';

import styles from './style.module.scss';
import { Product } from 'constants/types/product';
import { Carousel } from 'antd';
import { Link } from 'react-router-dom';
import routes from 'constants/routes';
import { CarouselRef } from 'antd/es/carousel';
interface Props {
    products: Product[]
}

export default function ProductCarousel({ products }: Props) {
    const [state, setState] = React.useState({
        currentCarouselIndex: 0,
    })

    const carouselRef = React.useRef<CarouselRef>(null)

    const afterChange = React.useCallback((currentIndex: any) => {
        setState((prevState) => ({ ...prevState, currentCarouselIndex: currentIndex }))
    }, [])

    const onClickCarousel = React.useCallback((index: any) => () => {
        carouselRef.current?.goTo(index)
    }, [])

    return (
        <div className={`${styles.productCarouselContainer}`}>
            <Carousel autoplay className={styles.AppCarousel} pauseOnHover={false} dots={false} afterChange={afterChange} ref={carouselRef}>
                {products.map((item) => (
                    <Link className={`${styles.carouselItemContainer}`} to={routes.ProductDetail(item.slug).path} key={item._id}>
                        <img src={item.images[0].url} className={styles.images} alt='' />
                    </Link>
                ))}
            </Carousel>
        </div>
    )

}