/* eslint-disable react/no-danger */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import { useIntl } from 'react-intl';

import { MinusSmIcon, PlusSmIcon, StarIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import useProductDetail from '../../modules/products/hooks/useProductDetail';
import renderPrice from '../../modules/common/utils/renderPrice';
import LoadingItem from '../../modules/common/components/LoadingItem';
import MetaTags from '../../modules/common/components/MetaTags';
import getAssortmentPath from '../../modules/assortment/utils/getAssortmentPath';
import AssortmentBreadcrumbs from '../../modules/assortment/components/AssortmentBreadcrumbs';
import getMediaUrl from '../../modules/common/utils/getMediaUrl';
import getMediaUrls from '../../modules/common/utils/getMediaUrls';
import NotFound from '../404';
import ProductReview from '../../modules/products/components/ProductReview';
import useProductReviews from '../../modules/products/hooks/useProductReviews';
import ProductListItem from '../../modules/products/components/ProductListItem';
import { bgColor } from '../../modules/common/data/miscellaneous';
import useUpdateCartItem from '../../modules/cart/hooks/useUpdateCartItem';
import useUser from '../../modules/auth/hooks/useUser';
import AddToCartButton from '../../modules/cart/components/AddToCartButton';

const Detail = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const [currentUrl, setCurrentUrl] = useState('');
  const { product, paths, loading } = useProductDetail({
    slug: router.query.slug,
  });
  const { user } = useUser();

  const { handleSubmit, register } = useForm();
  const { productReviews, loading: reviewLoading } = useProductReviews({
    productId: product?._id,
  });

  const { updateCartItem } = useUpdateCartItem();

  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(0);

  const onSubmit = (data) => {
    updateCartItem({
      itemId: product?._id,
      quantity: parseInt(data.quantity || '1', 10),
    });
  };

  const productPath = getAssortmentPath(paths);
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const totalUpVote = product?.reviews?.reduce(
    (prev, next) => prev + next.upVote,
    0,
  );

  const totalDownVote = product?.reviews?.reduce(
    (prev, next) => prev + next.downVote,
    0,
  );

  const averageVote = (totalUpVote / (totalUpVote + totalDownVote)) * 100;

  if (!product && !loading)
    return (
      <NotFound
        page={formatMessage({ id: 'products', defaultMessage: 'products' })}
      />
    );
  return (
    <>
      <MetaTags
        title={product?.texts?.title}
        imageUrl={getMediaUrl(product)}
        url={currentUrl}
        description={product?.texts?.description}
      />
      {loading ? (
        <LoadingItem />
      ) : (
        <div className="mt-2 pl-1 pb-16 sm:pb-24">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
            <div className="max-w-full lg:col-span-12 lg:col-start-1">
              <AssortmentBreadcrumbs
                paths={productPath}
                currentAssortment={product?.texts}
              />
            </div>

            <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:mt-0">
              <ImageGallery
                lazyLoad
                showThumbnails
                onErrorImageURL="/static/img/sun-glass-placeholder.jpeg"
                useBrowserFullscreen
                items={getMediaUrls(product).map((image) => ({
                  original: image,
                  thumbnail: image,
                }))}
              />
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <div className="flex justify-between">
                <h1
                  className="text-xl font-medium text-slate-900 dark:text-slate-100"
                  dangerouslySetInnerHTML={{ __html: product?.texts?.title }}
                />
                <p className="text-xl font-medium text-slate-900 dark:text-slate-100">
                  {renderPrice(product?.simulatedPrice)}
                </p>
              </div>
              <div>
                <h4
                  className="text-base font-normal text-slate-500 dark:text-slate-300"
                  dangerouslySetInnerHTML={{
                    __html: product?.texts?.subtitle,
                  }}
                />
              </div>

              {/* Reviews */}
              <div className="mt-4">
                <h2 className="sr-only">
                  {formatMessage({
                    id: 'reviews',
                    defaultMessage: 'Reviews',
                  })}
                </h2>
                <div className="flex items-center">
                  <p className="text-sm text-slate-700 dark:text-slate-100">
                    {averageVote || ''}
                    <span className="sr-only">
                      {formatMessage({
                        id: 'reviews',
                        defaultMessage: ' out of 5 stars',
                      })}
                    </span>
                  </p>
                  <div className="ml-1 flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={`${
                          averageVote >= rating * 20
                            ? 'text-yellow-400'
                            : 'text-slate-200'
                        } h-5 w-5 flex-shrink-0`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <div className="ml-4 flex">
                    <a
                      href="#"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {formatMessage({
                        id: 'all_reviews',
                        defaultMessage: `See all ${product?.reviews?.length} reviews`,
                      })}
                    </a>
                  </div>
                </div>
              </div>

              {/* Variations */}
              <div className="mt-8 lg:col-span-5">
                <AddToCartButton productId={product._id} />

                {/* Product details */}
                <div className="mt-10">
                  <h2 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {formatMessage({
                      id: 'description',
                      defaultMessage: 'Description',
                    })}
                  </h2>
                  <div
                    className="prose prose-sm mt-4 text-slate-500 dark:text-slate-300"
                    dangerouslySetInnerHTML={{
                      __html: product?.texts?.description,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Reviews */}
            {user &&
              (reviewLoading ? (
                <LoadingItem />
              ) : (
                <ProductReview
                  reviews={productReviews}
                  productId={product?._id}
                />
              ))}

            {/* Bundle products */}
            {product?.bundleItems && (
              <section
                aria-labelledby="related-heading"
                className="mt-16 sm:mt-24 lg:col-span-12"
              >
                <h2
                  id="related-heading"
                  className="text-lg font-medium text-slate-900 dark:text-slate-100"
                >
                  {formatMessage({
                    id: 'customers_also_purchased',
                    defaultMessage: 'Customers also purchased',
                  })}
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                  {product?.bundleItems?.map((bundleItem) => (
                    <div
                      key={bundleItem?.product._id}
                      className="group relative"
                    >
                      <ProductListItem product={bundleItem?.product} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Detail;
