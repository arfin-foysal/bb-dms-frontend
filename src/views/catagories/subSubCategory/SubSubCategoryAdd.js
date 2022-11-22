import React from 'react';
import { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetAllCatagoryQuery } from '../../../services/catagoryApi';
import { useGetAllSubCategoryQuery } from '../../../services/subCategoryApi';
import { useAddSubSubCategoryMutation } from '../../../services/subSubCategoryApi';

function SubCategoryAdd() {
  const history = useHistory();

  const [addSubSubCategory, { data, isSuccess }] = useAddSubSubCategoryMutation();

  const { data: category } = useGetAllCatagoryQuery();
  const { data: subCatagory } = useGetAllSubCategoryQuery();

  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [user_id, setUserId] = useState(1);
  const [catagory_id, setCatagoryId] = useState();
  const [sub_catagory_id, setSubCatagoryId] = useState();
  const [image, setImage] = useState();

  const submitHandel = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('user_id', user_id);
    formData.append('catagory_id', catagory_id);
    formData.append('sub_catagory_id', sub_catagory_id);
    formData.append('description', description);
    formData.append('image', image);
    await addSubSubCategory(formData);
  };

  

  if (isSuccess) {
    toast.success(data.message);
    history.push('/catagories/sub_sub_category');
  }

  // {category.data.map(val=>console.log(val.id))}

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h5">Add Sub Sub Category</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <Form onSubmit={submitHandel} encType="multipart/form-data">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Catagory Name" name="name" onChange={(e) => setName(e.target.value)} required />
              </Form.Group>

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
              <Form.Label>Category</Form.Label>
              <Form.Control as="select" className="mb-3" name="catagory_id" onChange={(e) => setCatagoryId(e.target.value)}>
                <option>Selact Category</option>
                {category?.data.map((cate) => (
                  <option value={cate.id}>{cate.name}</option>
                ))}
              </Form.Control>

              <Form.Label>Sub Category</Form.Label>
              <Form.Control as="select" className="mb-3" name="sub_catagory_id" onChange={(e) => setSubCatagoryId(e.target.value)}>
                <option>Selact Category</option>
                {subCatagory?.data.map((cate) => (
                  <option value={cate.id}>{cate.name}</option>
                ))}
              </Form.Control>

              <Form.Group controlId="exampleForm.ControlInput1">
                <input
                  type="file"
                  name="image"
                  accept="image/png ,image/jpg,image/jpeg , image/svg+xml ,application/pdf "
                  onChange={(e) => setImage(e.target.files[0])}
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