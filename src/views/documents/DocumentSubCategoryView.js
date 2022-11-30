import React, { useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import {
  BsArrowLeftCircleFill,
  BsFillEyeFill,
  BsPencilSquare,
  BsFillTrashFill,
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
  BsFillPlusCircleFill
} from 'react-icons/bs';
import { Link, useParams } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import { useDeleteDocumentMutation, useShowCategoryDocumentQuery, useShowSubCategoryDocumentQuery, useShowSubCategoryQuery, useShowSubSubCategoryQuery } from '../../services/documentApi';
import { useDispatch } from 'react-redux';
import { documentView } from '../../features/documentSlice';
import { toast } from 'react-toastify';
import DocumentSubCategory from './DocumentSubCategory';
import DocumentSubSubCategory from './DocumentSubSubCategory';

function DocumentSubCategoryView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, isFetching, isLoading, isError, isSuccess } = useShowSubCategoryDocumentQuery(id);

  const { data: subCategory, isSuccess: cateIssucess } = useShowSubSubCategoryQuery(id);

  const [deleteDocument] = useDeleteDocumentMutation();

  const deleteHandel = async (id) => {
    await deleteDocument(id);
  };

  if (isSuccess) {
    toast.success(data.message);
  }

  // console.log(subCategory);

  return (
    <>
      
      <div className="d-flex justify-content-between">
        <div className="mb-2">
          <Link to={`/documents/document_add`}>
            <Button>
              <BsFillArrowUpCircleFill color="white" className="mr-2 " />
              Uploade Document
            </Button>
          </Link>
        </div>

        <div>
        <Link to={`/catagories/sub_category_add`}>
          <Button>
            <BsFillPlusCircleFill color="white" className="mr-2 " />
            Add Sub Category
          </Button>
        </Link>
        </div>
      </div>
      <Card>
        <Card.Header className="">
          <div className=" d-flex justify-content-between ">
            <div>
              <Card.Title as="h5">Document</Card.Title>

              <span>
                <Link to={`/documents/document`}>
                  <BsArrowLeftCircleFill color="black" size={'20px'} />
                </Link>
              </span>
            </div>
          </div>
        </Card.Header>
        <div>{isLoading && <Loading />}</div>
        <div>{isError && <div>No Document:</div>}</div>
        <Card.Body>
          {cateIssucess && (
            <div>
              <Row>
                {subCategory.map((item) => (
                  <DocumentSubSubCategory item={item} />
                ))}
              </Row>
            </div>
          )}
          <Row>
            {data?.map((item) => (
              <Col key={item.id} className="d-flex align-items-center justify content center">
                <Card style={{ width: '12rem', height: '17rem' }} onClick={() => dispatch(documentView(item))}>
                  {item.file.split('.').pop().includes('png') || item.file.split('.').pop().includes('jpg') ? (
                    <Card.Img className="h-50" variant="top" src={`${process.env.REACT_APP_IMAGE_URL}${item.file}`} />
                  ) : (
                    <div className="box ">
                      <h2 className="bg-light text-center rounded text-uppercase">{item.file.split('.').pop()}</h2>
                    </div>
                  )}
                  <Card.Body className="py-2 px-2">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>Author by: {item.user.name}</Card.Text>
                  </Card.Body>

                  <div className=" text-center p-2 shadow m-3 ">
                    {item.file.split('.').pop().includes('pdf') ||
                    item.file.split('.').pop().includes('png') ||
                    item.file.split('.').pop().includes('jpg') ? (
                      <Link to={`/documents/document_view/${item.id}`}>
                        <BsFillEyeFill color="black" size={20} />
                      </Link>
                    ) : (
                      <a href={`${process.env.REACT_APP_IMAGE_URL}${item.file}`} download>
                        <BsFillArrowDownCircleFill color="black" size={18} />
                      </a>
                    )}

                    <Link to={`/catagories/sub_category_edit/${item.id}`} className="px-3">
                      <BsPencilSquare size={18} />
                    </Link>

                    <button className=" border-0 " onClick={() => deleteHandel(item.id)}>
                      <BsFillTrashFill color="red" size={17} />
                    </button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default DocumentSubCategoryView;