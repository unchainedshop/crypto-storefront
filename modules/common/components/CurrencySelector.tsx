import PropTypes from 'prop-types';
import useSupportedCurrencies from '../utils/useSupportedCurrencies';

const CurrencySelector = ({ onChange, selectedCurrency, className = '' }) => {
  const { currencies } = useSupportedCurrencies();
  return (
    <>
      <select
        className={`${className}`}
        onChange={onChange}
        value={selectedCurrency}
        key={selectedCurrency}
      >
        {currencies.map((currency) => (
          <option key={currency?._id} value={currency?.isoCode}>
            {currency?.isoCode}
          </option>
        ))}
      </select>
    </>
  );
};

CurrencySelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectedCurrency: PropTypes.string.isRequired,
};

export default CurrencySelector;
