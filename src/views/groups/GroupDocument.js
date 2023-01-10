import React from 'react';

import { Card, Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import {
  BsFillPlusCircleFill,
  BsXCircleFill,
  BsFillCheckCircleFill,
  BsFillEyeFill,
  BsFillArrowDownCircleFill,
  BsFillTrashFill,
  BsFillInfoCircleFill
} from 'react-icons/bs';
import { useGroupDeleteDocumentMutation, useGroupDocumentQuery, useSingalGroupQuery } from '../../services/groupApi';
import Loading from './../../components/Loading/Loading';
import file from './../../assets/images/File/word.png';
import axios from 'axios';
import Cookies from 'js-cookie';
import fileDownload from 'js-file-download';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useSelector } from './../../store/index';
import { HiUserGroup } from 'react-icons/hi';

function GroupDocument() {
  const { id } = useParams();
  
  const { data, isFetching, isSuccess } = useGroupDocumentQuery(id);
  const [groupDeleteDocument] = useGroupDeleteDocumentMutation();
  const { data: singalData, isFetching: singalDataFetching, isSuccess: singalDataSuccess } = useSingalGroupQuery(id);

  const auth = useSelector((state) => state.auth.user);


  const deleteHandel = async (Did) => {
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'error',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      width: 200,
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        groupDeleteDocument(Did);
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  };

  const download = (e, item) => {
    e.preventDefault();
    axios({
      url: `${process.env.REACT_APP_BASE_URL}download_file/${item.id}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`
      },
      responseType: 'blob'
    })
      .then((response) => {
        fileDownload(response.data, `${item.name}.${response.data.type.split('/').pop()}`);
      })
      .catch((error) => {
        console.log('sumthing went wrong');
      });
  };

  return (
    <>
      <div className="mb-2">
        <Link to={`/groups/group_add_document/${id}`}>
          <Button>
            <BsFillPlusCircleFill color="white" className="mr-2 " />
            Add Document
          </Button>
        </Link>
      </div>
      <Card>
        <Card.Header>
          {singalDataSuccess && <Card.Title as="h5">{singalData.data.name}</Card.Title>}
          {singalDataSuccess &&
            singalData.data.user.map((item) => (
              <span>
                <img
                  width={20}
                  alt={item.name}
                  className="rounded-circle pb-1 "
                  variant="top"
                  src={`${process.env.REACT_APP_IMAGE_URL}${item.image}`}
                />
              </span>
            ))}
        </Card.Header>
  
        {isFetching && <Loading />}
     

        {isSuccess && (
          <div className="d-flex flex-wrap justify-content-center justify-content-md-start">
            {data?.map((item) => (
              <div className="mx-1 sm-col-12" key={item.id}>
                <Card style={{ width: '15rem', height: '15rem' }}>
                  {item.file.split('.').pop().includes('png') ||
                  item.file.split('.').pop().includes('jpg') ||
                  item.file.split('.').pop().includes('jpeg') ||
                  item.file.split('.').pop().includes('gif') ? (
                    <Card.Img className="h-50" variant="top" src={`${process.env.REACT_APP_File_URL}${item.file}`} />
                  ) : (
                    <div className="box border border-bottom-0 pb-4 bg-info">
                      <img className="" width="100px" src={file} alt={file} />
                      <h3 className="bg-light file-sty  text-center rounded text-uppercase">{item.file.split('.').pop()}</h3>
                    </div>
                  )}

                  <Card.Body className="py-2 px-2 py-3 mb-4">
                    <div className=" d-flex justify-content-evenly">
                      <div className="mb-1 ">
                        <span>
                          <HiUserGroup className=" mx-1 mb-1" color="green" />
                          {item.group.name}
                        </span>
                      </div>
                      <div></div>
                    </div>

                    <Card.Title className="m-0 p-0 h6">
                      <b>{item.name.slice(0, 15)}</b>
                    </Card.Title>
                    <Card.Text className="m-0 p-0" style={{ fontSize: '11px' }}>
                      Created by: {item.user.name}
                    </Card.Text>
                  </Card.Body>

                  <div className=" text-center p-2 shadow my-3 mt-4">
                    {item.file.split('.').pop().includes('pdf') ||
                    item.file.split('.').pop().includes('png') ||
                    item.file.split('.').pop().includes('jpg') ||
                    item.file.split('.').pop().includes('jpeg') ||
                    item.file.split('.').pop().includes('txt') ? (
                      <div>
                        <Link to={`/groups/group_document_view/${item.id}`}>
                          <BsFillEyeFill color="blue" size={22} />
                        </Link>
                        <span className="pointer m-2">
                          <BsFillArrowDownCircleFill onClick={(e) => download(e, item)} color="black" size={18} />
                        </span>
                        {auth.id === item?.user.id && (
                          <BsFillTrashFill className="pointer mx-1" color="red" size={17} onClick={() => deleteHandel(item.id)} />
                        )}
                      </div>
                    ) : (
                      <div>
                        <span className="pointer m-2">
                          <BsFillArrowDownCircleFill onClick={(e) => download(e, item.id)} color="black" size={18} />
                        </span>
                        <span>
                          <Link to={`/groups/group_document_view/${item.id}`}>
                            <BsFillEyeFill color="blue" size={22} />
                          </Link>
                        </span>
                        {auth.id === item?.user.id && (
                          <BsFillTrashFill className="pointer mx-1" color="red" size={17} onClick={() => deleteHandel(item.id)} />
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

export default GroupDocument;
