import React from 'react';
import { Link } from 'react-router-dom';

import useAppSelector from 'hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { AppActions } from 'redux/slices/app';
import { CategoryActions } from 'redux/slices/category';

const HomePage = () => {
  const dispatch = useDispatch()

  const categories = useAppSelector((reduxState) => reduxState.category.categories);

  React.useEffect(() => {
    dispatch(CategoryActions.getCategories())
  }, [])

  console.log('reduxState > ', categories);

  return (
    <div>
      Root

      <Link to="/login">
        Go to login
      </Link>
    </div>
  );
}

export default HomePage;
