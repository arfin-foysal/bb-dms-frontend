import React from 'react';
import { useState, useRef } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { BsArrowLeftCircleFill } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetCategoryAllShowQuery, useGetSubCatagoryShowQuery } from '../../services/catagoryApi';
import { useAddDocumentMutation } from '../../services/documentApi';
import { useGetSubSubCatagoryShowQuery } from '../../services/subCategoryApi';
import { useSelector } from './../../store/index';
import JoditEditor from 'jodit-react';

function DocumentAdd() {
  const history = useHistory();
  const auth = useSelector((state) => state.auth.user);
  const [addDocument, res] = useAddDocumentMutation();
  const { data } = useGetCategoryAllShowQuery();
  const [name, setName] = useState();
  const [catagory_id, setCatagry_id] = useState();
  const [sub_catagory_id, setsub_catagory_id] = useState();
  const [sub_sub_catagory_id, setSub_sub_catagory_id] = useState();
  const [description, setDescription] = useState();
  const [admin_status] = useState();
  const [file, setFile] = useState();
  const [filePreview, setFilePreview] = useState();

  function handelImage(e) {
    setFilePreview(URL.createObjectURL(e.target.files[0]));
  }

  const editor = useRef(null);
  const submitHandel = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('user_id', auth.id);
    if (catagory_id === undefined) {
      toast.error('Please Select Catagory');
    }
    formData.append('catagory_id', catagory_id);
    if (sub_catagory_id !== undefined) {
      formData.append('sub_catagory_id', sub_catagory_id);
    }
    if (sub_sub_catagory_id !== undefined) {
      formData.append('sub_sub_catagory_id', sub_sub_catagory_id);
    }
    formData.append('description', description);

    formData.append('admin_status', admin_status);
    if (file !== undefined) {
      formData.append('file', file);
    }

    try {
      await addDocument(formData).unwrap();
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const { data: subCategoryShow } = useGetSubCatagoryShowQuery(catagory_id);
  const { data: subSubCategoryShow } = useGetSubSubCatagoryShowQuery(sub_catagory_id);

  if (res.isSuccess) {
    toast.success(res.data.message);
    history.goBack();
  }

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between">
          <div>
            <Card.Title as="h5">Add Document</Card.Title>
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
        <Row>
          <Col>
            <Form onSubmit={submitHandel} encType="multipart/form-data">
              <Row>
                <Col md={6}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Name" name="name" onChange={(e) => setName(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Row>
                    <Col>
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        as="select"
                        className="mb-3"
                        name="catagory_id"
                        onChange={(e) => setCatagry_id(e.target.value)}
                        required
                      >
                        <option>Selact Catagory</option>
                        {data?.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </Form.Control>
                    </Col>

                    
                    <Col className={catagory_id === undefined ? 'd-none' : 'd-block'}>
                      <Form.Label>Sub Category</Form.Label>
                      <Form.Control
                        as="select"
                        className="mb-3"
                        name="sub_catagory_id"
                        onChange={(e) => setsub_catagory_id(e.target.value)}
                      >
                        <option>Selact SC</option>

                        {subCategoryShow?.sub_catagory?.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col className={sub_catagory_id === undefined ? 'd-none' : 'd-block'}>
                      <Form.Label>Sub Sub Category</Form.Label>
                      <Form.Control
                        as="select"
                        className="mb-3"
                        name="sub_sub_catagory_id"
                        onChange={(e) => setSub_sub_catagory_id(e.target.value)}
                      >
                        <option >Selact SSC</option>

                        {subSubCategoryShow?.sub_sub_catagory?.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </Col>
              </Row>

       
              <Form.Label>Description</Form.Label>
              <JoditEditor
                ref={editor}
                value={description}
                // config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => setDescription(newContent)} // preferred to use only this option to update the content for performance reasons
                // onChange={(newContent) => {setDescription(newContent.target.value)}}
              />

              <img className="py-2" src={filePreview} width="90px" alt="" />

              <Form.Group controlId="exampleForm.ControlInput1">
                <input
                  type="file"
                  name="file"
                  accept="image/png ,image/jpg,image/jpeg , image/svg+xml ,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.slideshow,application/vnd.openxmlformats-officedocument.presentationml.presentation/application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document/application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet/application/vnd.oasis.opendocument.text/application/vnd.oasis.opendocument.spreadsheet/application/vnd.oasis.opendocument.presentation"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    handelImage(e);
                  }}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default DocumentAdd;
