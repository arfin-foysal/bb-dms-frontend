import React from 'react';
import { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { BsArrowLeftCircleFill } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetCategoryAllShowQuery, useGetSubCatagoryShowQuery } from '../../../services/catagoryApi';
// import { useGetAllSubCategoryQuery } from '../../../services/subCategoryApi';
import { useAddSubSubCategoryMutation } from '../../../services/subSubCategoryApi';
import { useSelector } from './../../../store/index';

function SubCategoryAdd() {
  const history = useHistory();
  const auth = useSelector((state) => state.auth.user);
  const [addSubSubCategory, { data, isSuccess }] = useAddSubSubCategoryMutation();
  const { data: category } = useGetCategoryAllShowQuery();
  // const { data: subCatagory } = useGetAllSubCategoryQuery();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [catagory_id, setCatagoryId] = useState();
  const [sub_catagory_id, setSubCatagoryId] = useState();
  const [image, setImage] = useState();
  const [previewImage, setImagePreview] = useState();
  const { data: subCategoryShow, isSuccess: cataSucess } = useGetSubCatagoryShowQuery(catagory_id);

  const submitHandel = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('user_id', auth.id);
    formData.append('catagory_id', catagory_id);
    formData.append('sub_catagory_id', sub_catagory_id);
    if (sub_catagory_id === undefined) {
      toast.error('Please Select Sub Catagory');
    }
    formData.append('description', description);
    if (image !== undefined) {
      formData.append('image', image);
    }
    await addSubSubCategory(formData);
  };

  if (isSuccess) {
    toast.success(data.message);
    history.goBack();
  }

  function handelImage(e) {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between">
          <div>
            <Card.Title as="h5">Add Sub Sub Category</Card.Title>
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
                <Col md={4}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Catagory Name" name="name" onChange={(e) => setName(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Label>Category</Form.Label>
                  <Form.Control as="select" className="mb-3" name="catagory_id" onChange={(e) => setCatagoryId(e.target.value)}>
                    <option>Selact Category</option>
                    {category?.map((cate, i) => (
                      <option key={i} value={cate.id}>
                        {cate.name}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={4}>
                  <Form.Label>Sub Category</Form.Label>
                  <Form.Control as="select" className="mb-3" name="sub_catagory_id" onChange={(e) => setSubCatagoryId(e.target.value)}>
                    <option>Selact Category</option>
                    {cataSucess &&
                      subCategoryShow?.sub_catagory?.map((subCate, i) => (
                        <option key={i} value={subCate?.id}>
                          {subCate?.name}
                        </option>
                      ))}
                  </Form.Control>
                </Col>
              </Row>

              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  placeholder="Catagory Description"
                  name="description"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <div>
                <img src={previewImage} className="py-2" width="90px" alt="" />
              </div>

              <Form.Group controlId="exampleForm.ControlInput1">
                <input
                  type="file"
                  name="image"
                  accept="image/png ,image/jpg,image/jpeg , image/svg+xml ,application/pdf "
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    handelImage(e);
                  }}
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

export default SubCategoryAdd;
