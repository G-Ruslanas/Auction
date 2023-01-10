import React from "react";
import "../pages/css/Pagination.css";

const Pagination = ({ auctionsPerPage, totalAuctions, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalAuctions / auctionsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a onClick={() => paginate(number)} href="#" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
