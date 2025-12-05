import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { useParams, useLocation } from 'react-router-dom';
import { feedOrdersSelect } from '../../services/feed';
import { userOrdersSelector } from '../../services/user';
import { ingredientsSelect } from '../../services/ingredients';
import { getOrderByNumber } from '../../services/order';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderNum = Number(number);
  const location = useLocation();

  const feedOrders = useSelector(feedOrdersSelect);
  const profileOrders = useSelector(userOrdersSelector);
  const allIngredients = useSelector(ingredientsSelect);

  const orderData = useMemo(() => {
    if (location.pathname.startsWith('/feed/')) {
      return feedOrders.find((o) => o.number === orderNum);
    } else if (location.pathname.startsWith('/profile/orders/')) {
      return profileOrders.find((o) => o.number === orderNum);
    } else return null;
  }, [location.pathname, orderNum, feedOrders, profileOrders]);

  useEffect(() => {
    if (!orderData) {
      dispatch(getOrderByNumber(+orderNum));
    }
  }, [dispatch, orderData, orderNum]);

  const ingredients: TIngredient[] = allIngredients;

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
