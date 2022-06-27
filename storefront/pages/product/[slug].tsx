/* eslint-disable react/no-danger */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import { useIntl } from 'react-intl';

import { HeartIcon, PhotographIcon, StarIcon } from '@heroicons/react/solid';
// eslint-disable-next-line no-unused-vars
import Image from 'next/image';
import classNames from 'classnames';

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
import calculateProductRating from '../../modules/products/utils/calculateProductRating';
// eslint-disable-next-line no-unused-vars
import defaultNextImageLoader from '../../modules/common/utils/defaultNextImageLoader';
import useUser from '../../modules/auth/hooks/useUser';
import useRemoveBookmark from '../../modules/common/hooks/useRemoveBookmark';

const Detail = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const [currentUrl, setCurrentUrl] = useState('');
  const { user } = useUser();

  const { product, paths, loading } = useProductDetail({
    slug: router.query.slug,
  });
  const { conditionalBookmarkProduct } = useConditionalBookmarkProduct();
  const { removeBookmark } = useRemoveBookmark();

  const [filteredBookmark] =
    user?.bookmarks?.filter(
      (bookmark) => bookmark?.product?._id === product?._id,
    ) || [];

  const productPath = getAssortmentPath(paths);
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const averageReview = calculateProductRating(product?.reviews);

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
        <div className="mt-2 bg-slate-100 pl-1 pb-16 dark:bg-slate-600 sm:pb-24">
          <div className="space-y-4 lg:grid lg:auto-rows-min lg:grid-cols-12 ">
            <div className="max-w-full lg:col-span-12 lg:col-start-1">
              <AssortmentBreadcrumbs
                paths={productPath}
                currentAssortment={product?.texts}
              />
            </div>

            <div className="mx-2 h-60 rounded-md border-2 bg-white dark:bg-slate-600 lg:col-span-6 lg:col-start-1 lg:h-auto">
              {getMediaUrls(product)?.length ? (
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
              ) : (
                <div className="relative h-full w-full">
                  {/* <Image
                    loading="lazy"
                    src="/static/img/sun-glass-placeholder.jpeg"
                    alt="sun-glass-placeholder"
                    layout="fill"
                    quality={100}
                    objectFit="cover"
                    objectPosition="center"
                    loader={defaultNextImageLoader}
                  /> */}
                  <PhotographIcon className="absolute inset-0 h-full w-full text-slate-200 dark:text-slate-500" />
                </div>
              )}
            </div>

            <div className="mx-2 rounded-md border-2 bg-white p-5 dark:bg-slate-600 lg:col-span-6">
              <div className="flex justify-between">
                <h1
                  className="text-xl font-medium text-slate-900 dark:text-slate-100"
                  dangerouslySetInnerHTML={{ __html: product?.texts?.title }}
                />
                <p className="text-xl font-medium text-slate-900 dark:text-slate-100">
                  {renderPrice(product?.simulatedPrice)}
                </p>
              </div>
              <h4
                className="text-base font-normal text-slate-500 dark:text-slate-300"
                dangerouslySetInnerHTML={{
                  __html: product?.texts?.subtitle,
                }}
              />
              <div className="mt-4 ">
                <h2 className="sr-only">
                  {formatMessage({
                    id: 'reviews',
                    defaultMessage: 'Reviews',
                  })}
                </h2>
                <div className="flex items-center">
                  <p className="text-sm text-slate-700 dark:text-slate-100">
                    {Math.round(averageReview * 100) / 100 || ''}
                    <span className="sr-only">
                      {formatMessage({
                        id: 'reviews_starts_range',
                        defaultMessage: ' out of 5 stars',
                      })}
                    </span>
                  </p>
                  <div className="ml-1 flex items-center">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={`${
                          averageReview >= rating
                            ? 'text-yellow-400'
                            : 'text-slate-200'
                        } h-5 w-5 flex-shrink-0`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <div className="ml-4 flex">
                    <a
                      href="#all_reviews"
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
              <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                {(product?.texts?.labels || [])?.map((label) => (
                  <label className="group relative flex cursor-pointer items-center justify-center rounded-md border bg-white py-3 px-4 text-sm font-medium uppercase text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none sm:flex-1 ">
                    <span id="size-choice-1-label"> {label} </span>

                    <span
                      className="pointer-events-none absolute -inset-px rounded-md"
                      aria-hidden="true"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-5 flex w-full justify-between">
                <AddToCartButton productId={product._id} />
                <button
                  type="button"
                  onClick={() =>
                    filteredBookmark
                      ? removeBookmark({
                          bookmarkId: filteredBookmark?._id,
                        })
                      : conditionalBookmarkProduct({
                          productId: product?._id,
                        })
                  }
                >
                  <HeartIcon
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className={classNames(
                      'h-8 w-8 text-slate-500 dark:text-slate-100',
                      {
                        'text-red-500 dark:text-red-200': filteredBookmark,
                      },
                    )}
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

            <div className="mx-2 rounded-md border-2 bg-white dark:bg-slate-600 lg:col-span-12">
              <ProductReview
                reviews={product?.reviews || []}
                productId={product?._id}
              />
            </div>

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
