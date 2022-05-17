import React, { useEffect, useState } from 'react';
import { Form, Table, Button } from "react-bootstrap";
import { PencilFill, Save, Trash, XSquare } from 'react-bootstrap-icons';
import moment from 'moment';
import { ModalWindow } from '../ModalWindow';
import './ContentTable.css';

const ContentTable = ({ 
  columns, 
  setColumns, 
  rows, 
  setRows, 
  actions 
}) => {
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
      return row.id !== rowID ? row : null;
    });
    setRows(newData);
    localStorage.setItem("tableRows", JSON.stringify(newData));
  }

  const handleRemoveColumn = (field) => {
    const newColumns = columns.filter(column => {
      return column.field !== field ? column : null;
    });
    setRows(rows.map((row) => {
      delete row[field];
      return row;
    }))
    setColumns(newColumns);
    localStorage.setItem("tableColumns", JSON.stringify(newColumns));
  }

  const handleOnChangeField = (e, rowID) => {
    const { name: fieldName, value } = e.target;
    const editedRowField = rowsState.filter(function(row) {
      return row.id === rowID;
    })[0][fieldName];
    let newDateValue = value;
    if (editedRowField[1] === 'date') {
        newDateValue = moment(value).format('DD.MM.YYYY');
      if (editedRowField.length === 3) {
        newDateValue = moment(value).format(editedRowField[2]);
      }
    } else if (editedRowField[1] === 'number') {
      newDateValue = parseFloat(parseFloat(value).toFixed(editedRowField[2]))
    }
    const fieldArray = [newDateValue, e.target.type];
    if (editedRowField.length === 3) {
      fieldArray.push(editedRowField[2]);
    }
    if (editedRow) {
      setEditedRow(prevState => ({
            ...prevState,
            [fieldName]: fieldArray
      }))
    } else {
      setEditedRow({
        id: rowID,
        [fieldName]: fieldArray
      })
    }
  }

  const handleCancelEditing = () => {
    setIsEditMode(false);
    setEditedRow(undefined);
  }

  const handleSaveRowChanges = () => {
    setIsEditMode(false);
    const newData = rowsState.map(row => {
      if (row.id === editedRow.id) {
        Object.keys(editedRow).map((k) => {
          if (k !== "id") {
            row[k] = editedRow[k]
          }
          return k;
        })
      }
      return row;
    })
    setRowsState(newData);
    setEditedRow(undefined);
    localStorage.setItem("tableRows", JSON.stringify(rows));
  }

  const addRow = () => {
    const newRow = JSON.parse(JSON.stringify(rows[rows.length - 1]));
    Object.keys(newRow).map((k) => {
      if (k === 'id') {
        newRow[k] = newRow[k] + 1;
      } else {
        newRow[k][0] = newRow[k][1];
      }
      return newRow[k];
    });
    setRows([...rows, newRow]);
  }

  useEffect (()=>{
    setRowsState(rows);
    localStorage.setItem("tableRows", JSON.stringify(rows));
    }, [rows]
  )

  const addColumn = () => {
    setVisible(true);
  }

  const refactorDate = (date) => {
    const dateArr = date.split('.').reverse();
    return moment(new Date(dateArr.join(', '))).format('YYYY-MM-DD');
  }

  return (
    <div>
      <ModalWindow
        visible={visible}
        setVisible={setVisible}
        columns={columns}
        setColumns={setColumns}
        rows={rows}
        setRows={setRows}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((column) => {
              return <th key={column.field}>
                { column.fieldName}
                <button onClick={() => handleRemoveColumn(column.field)} className='custom-table__action-btn'>
                  <Trash />
                </button>
              </th>
            })}
            <th key={'button'}>
              <Button variant='primary' onClick={addColumn}>Add column</Button> 
            </th>
          </tr>
        </thead>
        <tbody>
          {rowsState.map((row) => {
            let index = 0;
            return <tr key={row.id}>
              {Object.keys(row).map((k) => {
                if (k !== 'id') {
                  index += 1;
                  return <td key={`${row.id}.${index}`}>
                    { isEditMode && rowIDToEdit === row.id
                    ? <Form.Control
                    type={row[k][1]}
                    defaultValue={(row[k][1] === "date" ? refactorDate(row[k][0]) : (editedRow) ? editedRow.k : row[k][0])}
                    id={row.id}
                    name={k}
                    onChange={(e) => handleOnChangeField(e, row.id)}
                  />
                  : row[k][0]
                }
                  </td>
                } else {
                  return null;
                }
              })}
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
          </td>
          }
            </tr>
          })}
        </tbody>
      </Table>
      <Button variant='primary' onClick={addRow}>Add row</Button>
    </div>
  );
};

export { ContentTable };