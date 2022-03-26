import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import EditUser from "../components/EditUser";
import { useTable, usePagination } from "react-table";
import "./css/Profile.css";

const Profile = ({ user }) => {
  const [modalShow, setModalShow] = useState(false);
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const getAuctions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/auction/findbyuser/${user._id}`
        );
        setAuctions(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAuctions();
  }, [user._id]);

  const columns = useMemo(() => {
    return [
      { Header: "Title", accessor: "title" },
      { Header: "Category", accessor: "category" },
      { Header: "Purchase Price", accessor: "purchase_price" },
      { Header: "Bid Start", accessor: "bid_start" },
    ];
  }, []);

  const tableInstance = useTable(
    {
      columns: columns,
      data: auctions,
    },
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    setPageSize,
  } = tableInstance;

  const { pageIndex, pageSize } = state;

  return (
    <>
      <div className="profile">
        <div className="leftProfile">
          <img
            src={
              user.img
                ? `uploads/${user.img}`
                : "https://cdn5.vectorstock.com/i/1000x1000/51/99/icon-of-user-avatar-for-web-site-or-mobile-app-vector-3125199.jpg"
            }
            alt=""
            className="profileImage"
          />
        </div>
        <div className="rightProfile">
          <label htmlFor="">Username</label>
          <h1>{user.username}</h1>
          <label htmlFor="">Email</label>
          <h1>{user.email}</h1>
          <label htmlFor="">Role</label>
          <h1>{user.role !== "" ? user.role : "Regular User"}</h1>
          <button className="btn" onClick={() => setModalShow(true)}>
            Edit Profile
          </button>
          <EditUser
            show={modalShow}
            onHide={() => setModalShow(false)}
            user={user}
          ></EditUser>
        </div>
      </div>
      <h1 className="profileAuctions">Auctions</h1>
      <div>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                  <td>Valid</td>
                  <td className="buttons">
                    <button className="btn-warning">Edit</button>
                    <button className="btn-info">View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          <span className="paginationSpan">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
          <button
            className="btn-pagination"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            Previous
          </button>
          <button
            className="btn-pagination"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            Next
          </button>
          <select
            className="paginationSelect"
            name="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[1, 2, 5, 10].map((pageSize) => (
              <option value={pageSize} key={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default Profile;
