import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/solid';
import useConditionalAddCartProduct from '../hooks/useConditionalAddCartProduct';
import useUser from '../../auth/hooks/useUser';
import useUpdateCartItem from '../hooks/useUpdateCartItem';
import useRemoveCartItem from '../hooks/useRemoveCartItem';

const AddToCartButton = ({ productId }) => {
  const { register, setValue } = useForm();
  const { formatMessage } = useIntl();
  const { cart } = useUser();
  const { conditionalAddCartProduct } = useConditionalAddCartProduct();
  const { updateCartItem } = useUpdateCartItem();
  const { removeCartItem } = useRemoveCartItem();

  const cartEntry = cart?.items.find(
    ({ product }) => product._id === productId,
  );

  const quantity = cartEntry?.quantity || 0;

  useEffect(() => {
    setValue('quantity', quantity);
  }, [quantity]);

  const addToCart = () => {
    conditionalAddCartProduct({ productId });
  };

  const handleMinus = () => {
    const currentQuantity: number = cartEntry.quantity - 1;

    if (currentQuantity > 0) {
      updateCartItem({
        itemId: cartEntry._id,
        quantity: currentQuantity,
      });
    } else {
      removeCartItem({ itemId: cartEntry._id });
    }
  };

  const handleNumberInput = (event) => {
    if (event.currentTarget.value !== '') {
      const currentQuantity = parseInt(event.currentTarget.value, 10);

      if (currentQuantity > 0) {
        updateCartItem({
          itemId: cartEntry._id,
          quantity: currentQuantity,
        });
      } else {
        removeCartItem({ itemId: cartEntry._id });
      }
    }
  };

  return quantity ? (
    <div className="flex justify-between">
      <div className="flex w-full items-center">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={handleMinus}
        >
          <MinusSmIcon className="h-6 w-6" />
        </button>

        <button
          type="button"
          className="mx-auto flex items-center"
          onClick={addToCart}
        >
          <input
            name="quantity"
            ref={register}
            type="number"
            className="rounded border border-slate-300 p-1 text-center placeholder:font-bold placeholder:opacity-100 dark:bg-slate-500 dark:text-slate-100"
            min="1"
            max="100000"
            onChange={handleNumberInput}
            onClick={(event) => event.stopPropagation()}
          />
          <span className="ml-1">
            {formatMessage({ id: 'in_cart', defaultMessage: 'In cart' })}
          </span>
          <span className="icon icon--check ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height="16"
            >
              <path
                fill="currentColor"
                d="M23.146 5.4l-2.792-2.8a.5.5 0 00-.708 0L7.854 14.4a.5.5 0 01-.708 0l-2.792-2.8a.5.5 0 00-.708 0L.854 14.4a.5.5 0 000 .707L7.146 21.4a.5.5 0 00.708 0L23.146 6.1a.5.5 0 000-.7z"
              />
            </svg>
          </span>
        </button>

        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={addToCart}
        >
          <PlusSmIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  ) : (
    <button
      type="button"
      className="button button--primary button-add-to-cart mt-2 mb-3"
      aria-label="In Cart"
      onClick={addToCart}
    >
      <span>{formatMessage({ id: 'add_to_cart' })}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        height="18"
        className="ml-3"
      >
        <title>add-square-alternate</title>
        <path
          fill="currentColor"
          d="M21.545.25H2.455a2.206,2.206,0,0,0-2.2,2.2V21.546a2.207,2.207,0,0,0,2.205,2.2h19.09a2.207,2.207,0,0,0,2.2-2.2V2.454A2.206,2.206,0,0,0,21.545.25Zm-.3,21H2.75V2.75h18.5Z"
        />
        <path
          fill="currentColor"
          d="M6.273,13.25H10.5a.25.25,0,0,1,.25.25v4.227a1.25,1.25,0,0,0,2.5,0V13.5a.25.25,0,0,1,.25-.25h4.227a1.25,1.25,0,0,0,0-2.5H13.5a.25.25,0,0,1-.25-.25V6.272a1.25,1.25,0,1,0-2.5,0V10.5a.25.25,0,0,1-.25.25H6.273a1.25,1.25,0,0,0,0,2.5Z"
        />
      </svg>
    </button>
  );
};

export default AddToCartButton;
