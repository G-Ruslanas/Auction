import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import EditUser from "../components/EditUser";
import { useTable, usePagination } from "react-table";
import "./css/Profile.css";
import EditAuction from "../components/EditAuction";
import { Link } from "react-router-dom";
import CheckAuction from "../components/CheckAuction";
import CheckStatus from "../components/CheckStatus";
import AutomaticBid from "../components/AutomaticBid";
import CheckCancel from "../components/CheckCancel";
import "./css/Profile.css";
import SuspendUser from "../components/SuspendUser";

const Profile = ({ user }) => {
  const [modalShow, setModalShow] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [auction, setAuction] = useState({});
  const [editUserModal, setEditUserModal] = useState(false);
  const [editAutomaticBid, setEditAutomaticBid] = useState(false);
  const [checkModalShow, setCheckModalShow] = useState(false);
  const [checkStatusModal, setCheckStatusModal] = useState(false);
  const [currentTable, setCurrentTable] = useState(null);
  const [currentUserTable, setCurrentUserTable] = useState(false);
  const [suspendUserModal, setSuspendUserModal] = useState(false);
  const [cancelBid, setCancelBid] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const getAuctions = async () => {
      try {
        if (user.role === "admin") {
          const res = await axios.get("http://localhost:5000/auction/all");
          setAuctions(res.data);
        } else {
          const res = await axios.get(
            `http://localhost:5000/auction/findbyuser/${user._id}`
          );
          setAuctions(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAuctions();
  }, [user._id, user.role, checkModalShow, currentTable, editUserModal]);

  useEffect(() => {
    const getAutomaticBindsByUserId = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/automatic/find/${user._id}`
        );
        setBids(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAutomaticBindsByUserId();
  }, [user._id, currentTable, editAutomaticBid]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/find");
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllUsers();
  }, [suspendUserModal]);

  const handleClick = (row) => {
    setEditUserModal(true);
    setAuction(row);
  };

  const handleAutomaticBidClick = (row) => {
    setEditAutomaticBid(true);
    setAuction(row.auction_id);
  };

  const cancelAutomaticBid = async (row) => {
    setAuction(row);
    setCancelBid(true);
  };

  const handleOnClick = (row) => {
    setAuction(row);
    setCheckModalShow(true);
  };

  const handleCheck = (row) => {
    setAuction(row);
    setCheckStatusModal(true);
  };

  const columns = useMemo(() => {
    return [
      { Header: "Title", accessor: "title" },
      { Header: "Category", accessor: "category" },
      { Header: "Purchase Price", accessor: "purchase_price" },
      { Header: "Bid Start", accessor: "bid_start" },
      { Header: "Status", accessor: "valid" },
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

  const columnsSecond = useMemo(() => {
    return [
      { Header: "Max Automatic Bid", accessor: "automatic_bid" },
      { Header: "Status of Automation", accessor: "status" },
    ];
  }, []);

  const tableInstanceSecond = useTable(
    {
      columns: columnsSecond,
      data: bids,
    },
    usePagination
  );

  const {
    getTableProps: getSecondTableProps,
    getTableBodyProps: getSecondTableBodyProps,
    headerGroups: secondHeaderGroups,
    page: secondPage,
    prepareRow: secondPrepareRow,
    nextPage: secondNextPage,
    previousPage: secondPreviousPage,
    canNextPage: secondCanNextPage,
    canPreviousPage: secondCanPreviousPage,
    pageOptions: secondPageOptions,
    state: secondState,
    setPageSize: secondSetPageSize,
  } = tableInstanceSecond;

  const { pageIndex: secondPageIndex, secondPageSize } = secondState;

  const columnsThird = useMemo(() => {
    return [
      { Header: "Email", accessor: "email" },
      { Header: "Username", accessor: "username" },
      { Header: "Status", accessor: "status" },
    ];
  }, []);

  const tableInstanceThird = useTable(
    {
      columns: columnsThird,
      data: users,
    },
    usePagination
  );

  const {
    getTableProps: getThirdTableProps,
    getTableBodyProps: getThirdTableBodyProps,
    headerGroups: thirdHeaderGroups,
    page: thirdPage,
    prepareRow: thirdPrepareRow,
    nextPage: thirdNextPage,
    previousPage: thirdPreviousPage,
    canNextPage: thirdCanNextPage,
    canPreviousPage: thirdCanPreviousPage,
    pageOptions: thirdPageOptions,
    state: thirdState,
    setPageSize: thirdSetPageSize,
  } = tableInstanceThird;

  const { pageIndex: thirdPageIndex, thirdPageSize } = thirdState;
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
          {!user.googleId && (
            <>
              <label htmlFor="">Email</label>
              <h1>{user.email}</h1>
            </>
          )}

          <label htmlFor="">Role</label>
          <h1>{user.role !== "" ? user.role : "Regular User"}</h1>
          {!user.googleId && (
            <>
              <button className="btn" onClick={() => setModalShow(true)}>
                Edit Profile
              </button>
            </>
          )}

          <EditUser
            show={modalShow}
            onHide={() => setModalShow(false)}
            user={user}
          ></EditUser>
        </div>
      </div>

      <div className="profileButton">
        <button
          className="topProfileButtons"
          onClick={() => {
            setCurrentTable(true);
            setCurrentUserTable(false);
          }}
        >
          Edit Auctions
        </button>
        {user.role === "admin" && (
          <button
            className="topProfileButtons"
            onClick={() => {
              setCurrentUserTable(true);
              setCurrentTable(null);
            }}
          >
            Edit Users
          </button>
        )}

        <button
          className="topProfileButtons"
          onClick={() => setCurrentTable(false)}
        >
          Edit Automatic Bids
        </button>
      </div>

      {auctions.length !== 0 && currentTable === true ? (
        <>
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
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                      <td className="profileButtons">
                        {user.role !== "admin" ? (
                          row.original.valid !== "Pending" &&
                          row.original.status ? (
                            <>
                              {new Date(
                                row.original.start_date +
                                  " " +
                                  row.original.start_time
                              ) > new Date() && (
                                <button
                                  className="btn-warning"
                                  onClick={() => {
                                    handleClick(row.original);
                                  }}
                                >
                                  Edit
                                </button>
                              )}
                              <button
                                className="btn-dark"
                                onClick={() => {
                                  handleCheck(row.original);
                                }}
                              >
                                Check
                              </button>
                            </>
                          ) : row.original.valid === "No Winner" &&
                            row.original.status === false &&
                            user.status === "Active" ? (
                            <button
                              className="btn-warning"
                              onClick={() => {
                                handleClick(row.original);
                              }}
                            >
                              Edit
                            </button>
                          ) : (
                            "No Actions"
                          )
                        ) : (
                          <button
                            className="btn-info"
                            onClick={() => {
                              handleOnClick(row.original);
                            }}
                          >
                            Check
                          </button>
                        )}

                        {row.original.valid === "Valid" &&
                          row.original.status && (
                            <Link to={`/auction/${row.original._id}`}>
                              <button className="btn-info">View</button>
                            </Link>
                          )}
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

            {editUserModal && (
              <EditAuction
                show={editUserModal}
                onHide={() => setEditUserModal(false)}
                user={user}
                auction={auction}
                setAuction={setAuction}
              ></EditAuction>
            )}
            {checkModalShow && (
              <CheckAuction
                show={checkModalShow}
                user={user}
                auction={auction}
                onHide={() => setCheckModalShow(false)}
              ></CheckAuction>
            )}
            {checkStatusModal && (
              <CheckStatus
                show={checkStatusModal}
                user={user}
                auction={auction}
                onHide={() => setCheckStatusModal(false)}
              ></CheckStatus>
            )}
          </div>
        </>
      ) : currentTable === false && bids.length !== 0 ? (
        <>
          <h1 className="profileAuctions">Automatic Bids</h1>
          <div>
            <table {...getSecondTableProps()}>
              <thead>
                {secondHeaderGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))}
                    <th>Actions</th>
                  </tr>
                ))}
              </thead>
              <tbody {...getSecondTableBodyProps()}>
                {secondPage.map((row) => {
                  secondPrepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                            {}
                          </td>
                        );
                      })}
                      <td className="profileButtons">
                        {row.original.status === "In Progress" && (
                          <button
                            className="btn-warning"
                            onClick={() => {
                              handleAutomaticBidClick(row.original);
                            }}
                          >
                            Edit
                          </button>
                        )}

                        <Link to={`/auction/${row.original.auction_id}`}>
                          <button className="btn-info">View Auction</button>
                        </Link>
                        {row.original.status === "In Progress" && (
                          <button
                            className="btn-danger"
                            onClick={() => {
                              cancelAutomaticBid(row.original);
                            }}
                          >
                            Cancel
                          </button>
                        )}
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
                  {secondPageIndex + 1} of {secondPageOptions.length}
                </strong>
              </span>
              <button
                className="btn-pagination"
                onClick={() => secondPreviousPage()}
                disabled={!secondCanPreviousPage}
              >
                Previous
              </button>
              <button
                className="btn-pagination"
                onClick={() => secondNextPage()}
                disabled={!secondCanNextPage}
              >
                Next
              </button>
              <select
                className="paginationSelect"
                name="secondPageSize"
                value={secondPageSize}
                onChange={(e) => secondSetPageSize(Number(e.target.value))}
              >
                {[1, 2, 5, 10].map((pageSize) => (
                  <option value={pageSize} key={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>

            {editAutomaticBid && (
              <AutomaticBid
                show={editAutomaticBid}
                onHide={() => setEditAutomaticBid(false)}
                user={user}
                auction={auction}
              ></AutomaticBid>
            )}
            {checkModalShow && (
              <CheckAuction
                show={checkModalShow}
                user={user}
                auction={auction}
                onHide={() => setCheckModalShow(false)}
              ></CheckAuction>
            )}
            {cancelBid && (
              <CheckCancel
                show={cancelBid}
                onHide={() => setCancelBid(false)}
                auction={auction}
              ></CheckCancel>
            )}
          </div>
        </>
      ) : currentUserTable === true ? (
        <>
          <h1 className="profileAuctions">Users</h1>
          <div>
            <table {...getThirdTableProps()}>
              <thead>
                {thirdHeaderGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))}
                    <th>Actions</th>
                  </tr>
                ))}
              </thead>
              <tbody {...getThirdTableBodyProps()}>
                {thirdPage.map((row) => {
                  thirdPrepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                      <td className="profileButtons">
                        {row.original.status === "Active" ? (
                          <button
                            className="btn-warning"
                            onClick={() => {
                              setCurrentUserTable(true);
                              setCurrentTable(null);
                              setSuspendUserModal(true);
                              setCurrentUser(row.original);
                              setStatus("Suspend");
                            }}
                          >
                            Suspend User
                          </button>
                        ) : (
                          <button
                            className="btn-info"
                            onClick={() => {
                              setCurrentUserTable(true);
                              setCurrentTable(null);
                              setSuspendUserModal(true);
                              setCurrentUser(row.original);
                              setStatus("Activate");
                            }}
                          >
                            Restore User
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <SuspendUser
                show={suspendUserModal}
                onHide={() => setSuspendUserModal(false)}
                user={currentUser}
                status={status}
              ></SuspendUser>
              ;
            </table>

            <div className="pagination">
              <span className="paginationSpan">
                Page{" "}
                <strong>
                  {thirdPageIndex + 1} of {thirdPageOptions.length}
                </strong>
              </span>
              <button
                className="btn-pagination"
                onClick={() => thirdPreviousPage()}
                disabled={!thirdCanPreviousPage}
              >
                Previous
              </button>
              <button
                className="btn-pagination"
                onClick={() => thirdNextPage()}
                disabled={!thirdCanNextPage}
              >
                Next
              </button>
              <select
                className="paginationSelect"
                name="thirdPageSize"
                value={thirdPageSize}
                onChange={(e) => thirdSetPageSize(Number(e.target.value))}
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
      ) : (
        <h1 className="profileAuctions">No Information</h1>
      )}
    </>
  );
};

export default Profile;
