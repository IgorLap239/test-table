import React, { useEffect, useState } from 'react';
import { Form, Table, Button } from "react-bootstrap";
import { ModalWindow } from '../ModalWindow';
import { PencilFill, Save, Trash, XSquare } from 'react-bootstrap-icons';
import './ContentTable.css';

const ContentTable = ({ columns, setColumns, rows, setRows, actions }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [rowIDToEdit, setRowIDToEdit] = useState(undefined);
  const [rowsState, setRowsState] = useState(rows);
  const [editedRow, setEditedRow] = useState();
  const [visible, setVisible] = useState(false);

  const handleEdit = (rowID) => {
    setIsEditMode(true);
    setEditedRow(undefined);
    setRowIDToEdit(rowID);
  }

  const handleRemoveRow = (rowID) => {
    const newData = rowsState.filter(row => {
      return row.id !== rowID ? row : null
    });

    setRowsState(newData);
  }

  const handleOnChangeField = (e, rowID) => {
    let { name: fieldName, value } = e.target;
    if (fieldName === 'birthday') {
      value = new Date(value)
    }
    setEditedRow({
      id: rowID,
      [fieldName]: value
    })
  }

  const handleCancelEditing = () => {
    setIsEditMode(false);
    setEditedRow(undefined);
  }

  const handleSaveRowChanges = () => {
    setIsEditMode(false);

    const newData = rowsState.map(row => {
      if (row.id === editedRow.id) {
        if (editedRow.name) row.name = editedRow.name;
        if (editedRow.gental) row.gental = editedRow.gental;
        if (editedRow.email) row.email = editedRow.email;
        if (editedRow.birthday) row.birthday = editedRow.birthday;
      }

      return row;
    })

    setRowsState(newData);
    setEditedRow(undefined)
  }

  const addRow = () => {
    const newRow = {id: rows.length + 1, name: 'Enter Name', gental: 'Male', email: 'Enter@email', birthday: new Date()}
    setRows([...rows, newRow])
  }

  useEffect (()=>{
    setRowsState(rows);
    }, [rows]
  )

  const addColumn = () => {
    setVisible(true)
  }

  return (
    <div>
      <ModalWindow
        visible={visible}
        setVisible={setVisible}
        columns={columns}
        setColumns={setColumns}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((column) => {
              return <th key={column.field}>{ column.fieldName }</th>
            })}
          </tr>
        </thead>
        <tbody>
          {rowsState.map((row) => {
            return <tr key={row.id}>
              {Object.keys(row).map((k) => {
                let word = row[k]
                console.log('wordk = ', word);
                if (k !== 'id') {
                  return <td>
                    {word}
                  </td>
                } else {
                  return null;
                }
              })}
              {/*<td>
                { isEditMode && rowIDToEdit === row.id
                  ? <Form.Control
                    type='text'
                    defaultValue={editedRow ? editedRow.name : row.name}
                    id={row.id}
                    name='name'
                    onChange={ (e) => handleOnChangeField(e, row.id) }
                  />
                  : row.name
                }
              </td>
              <td>
                { isEditMode && rowIDToEdit === row.id
                  ? <Form.Select onChange={e => handleOnChangeField(e, row.id)} name="gental" defaultValue={row.gental}>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                  </Form.Select>
                  : row.gental
                }
              </td>
              <td>
                { isEditMode && rowIDToEdit === row.id
                  ? <Form.Control
                    type='email'
                    defaultValue={editedRow ? editedRow.email : row.email}
                    id={row.id}
                    name='email'
                    placeholder="name@example.com"
                    onChange={ (e) => handleOnChangeField(e, row.id) }
                  />
                  : row.email
                }
              </td>
              <td>
                { isEditMode && rowIDToEdit === row.id
                  ? <Form.Control
                    type='date'
                    id={row.id}
                    defaultValue={editedRow ? editedRow.birthday : row.birthday.toLocaleDateString().split('.').reverse().join('-')}
                    name='birthday'
                    onChange={ (e) => handleOnChangeField(e, row.id) }
                  />
                  : row.birthday.toLocaleDateString()
                }
              </td>
              {actions &&
              <td>
                { isEditMode && rowIDToEdit === row.id
                  ? <button onClick={ () => handleSaveRowChanges() } className='custom-table__action-btn' disabled={!editedRow}>
                    <Save />
                  </button>
                  : <button  onClick={ () => handleEdit(row.id) } className='custom-table__action-btn'>
                    <PencilFill />
                  </button>
                }

                { isEditMode && rowIDToEdit === row.id
                  ? <button onClick={() => handleCancelEditing()} className='custom-table__action-btn'>
                    <XSquare />
                  </button>
                  : <button onClick={() => handleRemoveRow(row.id)} className='custom-table__action-btn'>
                    <Trash />
                  </button>
                }
              </td>*/}
              <td>
                { isEditMode && rowIDToEdit === row.id
                  ? <button onClick={ () => handleSaveRowChanges() } className='custom-table__action-btn' disabled={!editedRow}>
                    <Save />
                  </button>
                  : <button  onClick={ () => handleEdit(row.id) } className='custom-table__action-btn'>
                    <PencilFill />
                  </button>
                }

                { isEditMode && rowIDToEdit === row.id
                  ? <button onClick={() => handleCancelEditing()} className='custom-table__action-btn'>
                    <XSquare />
                  </button>
                  : <button onClick={() => handleRemoveRow(row.id)} className='custom-table__action-btn'>
                    <Trash />
                  </button>
                }
              </td>
            </tr>
          })}
        </tbody>
        
      </Table>
      
      <Button variant='primary' onClick={addRow}>Add row</Button>
      <Button variant='primary' onClick={addColumn}>Add column</Button> 
    </div>
  );
};

export { ContentTable };