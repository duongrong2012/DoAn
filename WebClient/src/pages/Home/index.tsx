import React from 'react';
import { Link } from 'react-router-dom';

import useAppSelector from 'hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { AppActions } from 'redux/slices/app';

const HomePage = () => {
  const dispatch = useDispatch()

  const reduxState = useAppSelector((reduxState) => reduxState);

  React.useEffect(() => {
    dispatch(AppActions.setAppState({ name: "Tri" }))
  }, [])

  console.log('reduxState > ', reduxState);

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
