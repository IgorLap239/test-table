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
  const [search, setSearch] = useState();
  const [saveActive, setSaveActive] = useState(true)

  useEffect(() => {
    const filteredArr = rows;
    if (search) {
      let newArray = filteredArr.filter(function (el) {
        let counter = 0;
        Object.keys(el).forEach((k) => {
          if (k !== 'id' && search[k] !== "\\") {
            const searchReg = new RegExp(`${search[k]}`, 'i');
            if (String(el[k][0]).match(searchReg)) {
              counter += 1;
            }
          }
        })
        return counter === Object.keys(search).length;
      });
      setRowsState(newArray);
    }
  }, [search])

  const changeSearchValue = (e, column) => {
    e.target.nextElementSibling.style.transform = (e.target.value !== '') ? 'scaleX(1)' : '';
    if (!search) {
      setSearch({[column]: e.target.value});
    } else {
      setSearch(prevState => ({
        ...prevState,
        [column]: e.target.value
      }))
    }
  }

  const editRow = (rowID) => {
    setIsEditMode(true);
    setEditedRow(undefined);
    setRowIDToEdit(rowID);
    setSaveActive(true);
  }

  const removeRow = (rowID) => {
    const newData = rowsState.filter(row => {
      return row.id !== rowID ? row : null;
    });
    setRows(newData);
    localStorage.setItem("tableRows", JSON.stringify(newData));
  }

  const removeColumn = (field) => {
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

  const onChangeField = (e, rowID) => {
    let { name: fieldName, value } = e.target;
    const editedRowField = rowsState.filter(function(row) {
      return row.id === rowID;
    })[0][fieldName];
    let regexp = /[0-9]/g;
    if (editedRowField[1] === 'text' && fieldName !== "email") {
      e.target.value = value.replace(regexp, '');
    }
    if (fieldName === "email") {
      regexp = /^([A-Za-z0-9_\-\.])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/g;
      if (!value.match(regexp)) {
        setSaveActive(true);
      } else {
        setSaveActive(false);
      }
    } else if (fieldName === "gental") {
      regexp = /^([F|f]emale)|([M|m]ale)$/g;
      if (!value.match(regexp)) {
        setSaveActive(true);
      } else {
        setSaveActive(false);
      }
    } else {
      setSaveActive(false);
    }
    let newValue = value;
    if (editedRowField[1] === 'date') {
        newValue = moment(value).format('DD.MM.YYYY');
      if (editedRowField.length === 3) {
        newValue = moment(value).format(editedRowField[2]);
      }
    } else if (editedRowField[1] === 'number') {
      newValue = parseFloat(parseFloat(value).toFixed(editedRowField[2]))
    } 
    const fieldArray = [newValue, e.target.type];
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

  const cancelEditing = () => {
    setIsEditMode(false);
    setEditedRow(undefined);
  }

  const saveRowChanges = () => {
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

  const clearInput = (e) => {
    e.target.previousElementSibling.value='';
    e.target.previousElementSibling.dispatchEvent(new Event('input', { bubbles: true }));
  }

  return (
    <div className='table-wrapper'>
      <ModalWindow
        visible={visible}
        setVisible={setVisible}
        columns={columns}
        setColumns={setColumns}
        rows={rows}
        setRows={setRows}
      />
      <Table className='content-table' striped bordered hover>
        <thead>
          <tr>
            {columns.map((column) => {
              return <th className='table-title' key={column.field}>
                <div>
                  { column.fieldName}
                  <button 
                  onClick={() => removeColumn(column.field)} 
                  className='custom-table__action-btn'
                  >
                    <Trash />
                  </button>
                </div>
                <input 
                  className='search' 
                  type="text" 
                  placeholder="Filter"
                  onInput={(e)=>changeSearchValue(e, column.field)}
                />
                <span onClick={clearInput}>×</span>
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
                  return <td className='table-cell' key={`${row.id}.${index}`}>
                    { isEditMode && rowIDToEdit === row.id
                    ? <Form.Control
                    type={row[k][1]}
                    defaultValue={(row[k][1] === "date" ? refactorDate(row[k][0]) : (editedRow) ? editedRow.k : row[k][0])}
                    id={row.id}
                    name={k}
                    onChange={(e) => onChangeField(e, row.id)}
                  />
                  : row[k][0]
                }
                  </td>
                } else {
                  return null;
                }
              })}
              {actions &&
          <td className='table-cell'>
            { isEditMode && rowIDToEdit === row.id
              ? <button className='custom-table__action-btn' onClick={ () => saveRowChanges() } disabled={saveActive}>
                <Save />
              </button>
              : <button className='custom-table__action-btn' onClick={ () => editRow(row.id) } >
                <PencilFill />
              </button>
            }
            { isEditMode && rowIDToEdit === row.id
              ? <button className='custom-table__action-btn' onClick={() => cancelEditing()}>
                <XSquare />
              </button>
              : <button onClick={() => removeRow(row.id)} className='custom-table__action-btn'>
                <Trash />
              </button>
            }
          </td>
          }
            </tr>
          })}
        </tbody>
      </Table>
      <Button className='add-dutton' variant='primary' onClick={addRow}>Add row</Button>
    </div>
  );
};

export { ContentTable };