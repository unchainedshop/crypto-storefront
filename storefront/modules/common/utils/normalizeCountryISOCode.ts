const normalizeCountryISOCode = (locale, isoCode, showIso = true) => {
  if (!isoCode) return '';

  try {
    return `${new Intl.DisplayNames([locale], { type: 'region' }).of(
      isoCode,
    )} ${showIso ? `(${isoCode})` : ''}`;
  } catch {
    return isoCode;
  }
};

export default normalizeCountryISOCode;
