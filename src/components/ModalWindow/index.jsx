import React, { useState, useEffect } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import moment from 'moment';
import './ModalWindow.css'

const ModalWindow = ({ visible, 
  setVisible, 
  columns, 
  setColumns, 
  rows, 
  setRows
}) => {
  const [newColumnName, setNewColumnName] = useState('');
  const [type, setType] = useState('text');
  const [format, setFormat] = useState('');
  const [save, setSave] = useState(false);

  const handleClose = () => {
    setNewColumnName('');
    setType('text');
    setFormat('');
    setVisible(false);
  }

  const changeType = (e) => {
    setType(e.target.value);
    if (e.target.value !== 'text') {
      setSave(true)
    }
  }

  const checkFormat = (e) => {
    const { value } = e.target;
    let reg = /.*/;
    if (type === 'number') {
      reg = /^0$|(^0\.(0{1,8})?)$/;
    } else if (type === 'date') {
      reg = /^(?:(?:дд|ДД|dd|DD|мм|ММ|mm|MM|гггг|ГГГГ|гг|ГГ|yy|yyyy|YY|YYYY))(?:\/|-|\.)(?:(?:дд|ДД|dd|DD|мм|ММ|mm|MM|гггг|ГГГГ|гг|ГГ|yy|yyyy|YY|YYYY))(?:\/|-|\.)(?:(?:дд|ДД|dd|DD|мм|ММ|mm|MM|гггг|ГГГГ|гг|ГГ|yyyy|YYYY|YY|yy))$/
    }
    setFormat(value);
    if (!value.match(reg)) {
      setSave(true)
    } else {
      setFormat(value);
      setSave(false)
    }
  }

  const addNewColumn = () => {
    const newColumn = {
        field: `${newColumnName.toLocaleLowerCase()}`,
        fieldName: newColumnName,
    };
    setColumns([...columns, newColumn]);
    let defValue = 'text';
    let resFormat = format;
    if (type === 'number') {
      if (resFormat !== '0') {
        resFormat = format.split('.')[1].length;
      }
      defValue = parseFloat((1.234566789).toFixed(resFormat))
    } else if (type === 'date') {
      if (format) {
        resFormat = format.toUpperCase().replace("Д", "D").replace("М", "M").replace("Г", "Y");
      }
      defValue = moment(new Date()).format(resFormat);
    }
    const newProperty = {                  
      [newColumnName.toLocaleLowerCase()] : [defValue, `${type}`]  
    };
    if (format !== "text") {
      newProperty[newColumnName.toLocaleLowerCase()].push(resFormat);
    }
    const newRows = rows.map(item => ({...item, ...newProperty}));
    setRows(newRows);
    handleClose();
  }

  useEffect(()=>{
    localStorage.setItem("tableColumns", JSON.stringify(columns));
  }, [columns])

  return (
    <Modal 
      show={visible} 
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add column</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
            <Form.Label className='form-label'>NAME</Form.Label>
            <Form.Control
              className='form-control'
              type='text'
              placeholder='New column title'
              value={newColumnName}
              onChange={(e)=>setNewColumnName(e.target.value)}
              autoFocus
            />
          </Form.Group>
          <Form.Group
            className='mb-3'
            controlId='exampleForm.ControlSelect1'
          >
            <Form.Label className='form-label'>TYPE</Form.Label>
            <Form.Select className='form-select' onInput={changeType}>
              <option value='text'>Text</option>
              <option value='number'>Number</option>
              <option value='date'>Date</option>
            </Form.Select>
          </Form.Group>
          { type !== 'text' ?
            <Form.Group className='mb-3' controlId='exampleForm.ControlInput2'>
              <Form.Label>FORMAT</Form.Label>
              <Form.Control
                type="text"
                placeholder={type === 'number' ? '0 - 0.00000' : 'dd.mm.yyyy'}
                onChange={checkFormat}
                value={format}
              />
            </Form.Group> 
            : null
          }
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
        <Button 
          variant='primary' 
          onClick={addNewColumn}
          disabled={save}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
  
export { ModalWindow };