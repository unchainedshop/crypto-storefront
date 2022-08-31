import { useIntl } from 'react-intl';
import normalizeCountryISOCode from '../../common/utils/normalizeCountryISOCode';

const DeliveryAddress = ({ onEdit, address }) => {
  const { locale, formatMessage } = useIntl();

  const { contact, deliveryInfo, billingAddress } = address;
  const {
    firstName,
    lastName,
    postalCode,
    city,
    addressLine,
    addressLine2,
    company,
    countryCode,
  } = deliveryInfo?.address || billingAddress;
  const { emailAddress, telNumber } = contact;

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="flex items-start justify-between">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {formatMessage({
              id: 'delivery_address',
              defaultMessage: 'Delivery Address',
            })}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {formatMessage({
              id: 'address_info',
              defaultMessage: 'Address used for order delivery',
            })}
          </p>
        </div>
        <button
          type="submit"
          onClick={onEdit}
          className="rounded-md border border-transparent bg-indigo-600 py-1 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          {formatMessage({
            id: 'edit',
            defaultMessage: 'Edit',
          })}
        </button>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              {formatMessage({ id: 'full_name', defaultMessage: 'Full name' })}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {firstName} {lastName}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              {formatMessage({ id: 'telephone', defaultMessage: 'Telephone' })}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{telNumber}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              {formatMessage({
                id: 'email_address',
                defaultMessage: 'Email address',
              })}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{emailAddress}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              {formatMessage({
                id: 'postal_code',
                defaultMessage: 'Postal Address',
              })}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{postalCode}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              {formatMessage({
                id: 'address',
                defaultMessage: 'Address',
              })}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {addressLine}
              {addressLine2 && `, ${addressLine2}`}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              {formatMessage({
                id: 'company',
                defaultMessage: 'company',
              })}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{company}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              {formatMessage({
                id: 'city',
                defaultMessage: 'City',
              })}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{city}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              {formatMessage({
                id: 'country',
                defaultMessage: 'Country',
              })}
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {normalizeCountryISOCode(locale, countryCode)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default DeliveryAddress;
