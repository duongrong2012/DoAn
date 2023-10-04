import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/store';

const useAppSelector = useSelector<ReduxState>;

export default useAppSelector;
