import { useIntl } from 'react-intl';
import renderPrice from '../../common/utils/renderPrice';

const OrderPriceSummary = ({ order }) => {
  const { formatMessage } = useIntl();
  return (
    <dl className="space-y-6 border-t border-slate-200 py-6 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <dt className="text-sm">
          {formatMessage({
            id: 'subtotal_vat',
            defaultMessage: 'Subtotal(vat included) 7.7%',
          })}
        </dt>
        <dd className="text-sm font-medium text-slate-900 dark:text-white">
          {renderPrice(order?.itemsTotal)}
        </dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-sm">
          {formatMessage({ id: 'shipping', defaultMessage: 'Shipping' })}
        </dt>
        <dd className="text-sm font-medium text-slate-900 dark:text-white">
          {renderPrice(order?.delivery)}
        </dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-sm">
          {formatMessage({ id: 'taxes', defaultMessage: 'Taxes' })}
        </dt>
        <dd className="text-sm font-medium text-slate-900 dark:text-white">
          {renderPrice(order?.taxes)}
        </dd>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <dt className="text-base font-medium">
          {formatMessage({ id: 'total', defaultMessage: 'Total' })}
        </dt>
        <dd className="text-base font-medium text-slate-900 dark:text-white">
          {renderPrice(order?.total)}
        </dd>
      </div>
    </dl>
  );
};

export default OrderPriceSummary;
