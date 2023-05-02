import React from 'react';
import { useState } from 'react';
import { Card, Table } from 'react-bootstrap';

import Pagination from 'react-bootstrap/Pagination';

import { ToastContainer } from 'react-toastify';
import UserTableBody from './UserTableBody';
import Loading from '../../components/Loading/Loading';
import { useGetAllUserQuery } from '../../services/userApi';
import { BsArrowLeftCircleFill } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';

function UserTable() {
  const history = useHistory();
  const [page, setPage] = useState(1);
  const { data, isFetching, isLoading, isSuccess } = useGetAllUserQuery(page);
  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  } else if (!data?.data) {
    return <div>No Users List :(</div>;
  } else {
    return (
      <>
        <ToastContainer />
        <div className="mb-2"></div>
        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between">
              <div>
                <Card.Title as="h5">User List</Card.Title>
              </div>
              <div>
                <span className="me-auto pointer">
                  <div onClick={() => history.goBack()}>
                    <BsArrowLeftCircleFill color="black" size={'20px'} />
                  </div>
                </span>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Table responsive striped>
              <thead style={{ background: 'grey' }}>
                <tr className=" text-white">
                  <th>ID</th>
                  <th>Name</th>
                  <th>username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Gender</th>
                  <th>Number</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{isSuccess && data.data.map((user, index) => <UserTableBody key={index} user={user} index={index} />)}</tbody>
            </Table>

            <Pagination className=" justify-content-end   mr-5">
              <Pagination.Prev onClick={() => setPage(page - 1)} isLoading={isFetching} />
              <Pagination.Next onClick={() => setPage(page + 1)} isLoading={isFetching} />
            </Pagination>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default UserTable;
