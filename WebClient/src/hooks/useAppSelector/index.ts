import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { ReduxState } from 'redux/store';

const useAppSelector: TypedUseSelectorHook<ReduxState> = useSelector;

export default useAppSelector;