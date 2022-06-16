/* eslint-disable react/no-danger */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import { useIntl } from 'react-intl';

import { StarIcon } from '@heroicons/react/solid';
import { HeartIcon } from '@heroicons/react/outline';
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
import ProductListItem from '../../modules/products/components/ProductListItem';
import AddToCartButton from '../../modules/cart/components/AddToCartButton';
import useConditionalBookmarkProduct from '../../modules/cart/hooks/useConditionalBookmarkProduct';

const Detail = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const [currentUrl, setCurrentUrl] = useState('');

  const { product, paths, loading } = useProductDetail({
    slug: router.query.slug,
  });
  const { conditionalBookmarkProduct } = useConditionalBookmarkProduct();

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
        page={formatMessage({ id: 'products', defaultMessage: 'Products' })}
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

            <div className="mt-8 lg:col-span-5 lg:col-start-1  lg:mt-0">
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
                        id: 'reviews_starts_range',
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
                      {formatMessage(
                        {
                          id: 'all_reviews',
                          defaultMessage: `See all {totalReviews} reviews`,
                        },
                        {
                          totalReviews: product?.reviews?.length,
                        },
                      )}
                    </a>
                  </div>
                </div>
              </div>

              <div>
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
              <div className=" mt-5 flex w-full justify-evenly ">
                <AddToCartButton productId={product._id} />
                <button
                  type="button"
                  onClick={() =>
                    conditionalBookmarkProduct({ productId: product?._id })
                  }
                  className="ml-4 flex items-center justify-center rounded-md py-3 px-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <HeartIcon
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-6 w-6"
                  />

                  <span className="sr-only">
                    {formatMessage({
                      id: 'bookmark',
                      defaultMessage: 'Bookmark',
                    })}
                  </span>
                </button>
              </div>
            </div>

            {
              <ProductReview
                reviews={product?.reviews || []}
                productId={product?._id}
              />
            }

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
