import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import arrow from './images/arrow.svg';
import { URL_PARAMS } from 'consts';
import './Pagination.scss';

type Props = {
  page: number;
  pagesAmount: number;
};

const Pagination = ({ page, pagesAmount }: Props) => {
  const [searchParams] = useSearchParams();
  const totalPages = Math.ceil(pagesAmount / INITIAL_LIMIT_BY_PAGE);
  const prevPage = page - 1;
  const nextPage = page + 1;
  const prevPageClasses = `pagination--box ${page === 1 && 'disabled'}`;
  const nextPageClasses = `pagination--box ${page === totalPages && 'disabled'}`;

  const getTo = (pageValue: number) => {
    searchParams.set(URL_PARAMS.PAGE, String(pageValue));

    return { search: searchParams.toString() };
  };

  return (
    <div className="pagination">
      <Link className={prevPageClasses} to={getTo(prevPage)}>
        <img className="pagination--img-prev" src={arrow} alt="arrow" />
      </Link>
      <button type="button" className="pagination--box selected">
        {page}
      </button>
      <p className="pagination__total">of {totalPages}</p>
      <Link className={nextPageClasses} to={getTo(nextPage)}>
        <img className="pagination--img" src={arrow} alt="arrow" />
      </Link>
    </div>
  );
};

export { Pagination };
