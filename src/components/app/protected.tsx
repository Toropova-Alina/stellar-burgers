import { FC, ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import {
  isAuthenticatedSelector,
  isAuthCheckedSelector,
  checkUser
} from '../../services/user';

interface ProtectedRouteProps {
  children: ReactNode;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth
}) => {
  const dispatch = useDispatch();
  const user = useSelector(isAuthenticatedSelector);
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const location = useLocation();
  const from = location.state?.from || '/';

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkUser());
    }
  }, [dispatch, isAuthChecked]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to={from} />;
  }

  return children;
};
