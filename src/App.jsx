import React, { useState } from 'react';
import moment from 'moment';
import { ContentTable } from './components/ContentTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  /* default data */
  const defColumns = [
    { field: 'name', fieldName: 'Name' },
    { field: 'gental', fieldName: 'Gental' },
    { field: 'email', fieldName: 'E-mail' },
    { field: 'birthday', fieldName: 'Birthday' },
  ];

  const date1 = moment(new Date(1993, 0, 22)).format('DD.MM.YYYY');
  const date2 = moment(new Date(1999, 3, 17)).format('DD.MM.YYYY');
  const date3 = moment(new Date(1995, 4, 5)).format('DD.MM.YYYY');
  const date4 = moment(new Date(1996, 7, 31)).format('DD.MM.YYYY');
  const date5 = moment(new Date(2001, 10, 22)).format('DD.MM.YYYY');

  const defRows = [
    { id: 1, name: ['James', "text"], gental: ['Male', "text"], email: ['jhsdfgh@hotmail.com', "email"], birthday: [date1, "date"]},
    { id: 2, name: ['Sams', "text"], gental: ['Male',"text"], email: ['hhfdfg@hotmail.com', "email"], birthday: [date2, "date"]},
    { id: 3, name: ['Mary', "text"], gental: ['Female', "text"], email: ['vccch@gmail.com', "email"], birthday: [date3, "date"]},
    { id: 4, name: ['Ashly', "text"], gental: ['Female', "text"], email: ['asss@gmail.com', "email"], birthday: [date4, "date"]},
    { id: 5, name: ['Eden', "text"], gental: ['Male', "text"], email: ['edd@hotmail.com', "email"], birthday: [date5, "date"]}
  ];
  /* end of default data */

  const [columns, setColumns] = useState(JSON.parse(localStorage.getItem("tableColumns")) || defColumns);
  const [rows, setRows] = useState(JSON.parse(localStorage.getItem("tableRows")) || defRows);

  return (
    <div className="app">
      <ContentTable 
        columns={columns}
        setColumns={setColumns}
        rows={rows}
        setRows={setRows}
        actions 
      />
    </div>
  );
}

export default App;
