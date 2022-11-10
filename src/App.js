import React, { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import logo from './logo.svg';
import './App.css';
import { nanoid } from 'nanoid';
import Selectable from 'selectable.js';
import { useCallback } from 'react';

function App() {
  const [siArrS, setSiArrS] = useState([]);
  const [currrentID, setCurrentID] = useState('');
  /* выделение группы ячеек (selectable.js) не заработало
  const [selected, setSelected] = useState('');
  useEffect(() => {
    const tbody1 = document.getElementById('tbody1');
    const selectable = new Selectable({
      appendTo: tbody1,
      autoRefresh: false,
      lasso: {
        border: '1px solid blue',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
      },

      // ignore: [`input`],
    });
    // selectable.init();
    selectable.on('init', function () {
      console.log('instance is ready');
    });
    selectable.on('start', function (e, item) {
      console.log('start', e, item);
    });
    selectable.on('selecteditem', function (item) {
      console.log('selecteditem', item);
    });
    selectable.on('addeditem', function (item) {
      console.log('addeditem', item);
    });
    selectable.on('end', function (e, selected, unselected) {
      console.log('end', e, selected, unselected);
    });
  });*/
  let sechID;
  useEffect(() => {
    console.log(document.URL, window.location.search);
    let url = new URL(document.URL);
    sechID = url.searchParams.get('sechID');
    console.log(sechID);
  }, []);
  const fdel = async () => {
    let sechId = {};
    sechId.id = sechID;
    console.log(`sechId`, sechId);

    let delSech = await fetch(`http://localhost:3001/api/delsech`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sechId),
    });

    delSech.json();
    console.log(`/api/delsech`, delSech);
  };

  const readFile = (e) => {
    const workbook = new ExcelJS.Workbook();
    console.log('func readFile', e);
    let file = e.target.files.item(0);
    console.log(file);
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async function () {
      await workbook.xlsx.load(reader.result);
      const worksheet = workbook.getWorksheet('Лист 1');
      // let row = worksheet.getRow(5).values;
      // console.log(row[17])

      function sameChar(str) {
        const sameCharEn = [
          'A',
          'a',
          'B',
          'C',
          'c',
          'E',
          'e',
          'H',
          'K',
          'k',
          'M',
          'O',
          'o',
          'P',
          'p',
          'T',
          'X',
          'x',
          'y',
        ];
        const sameCharRu = [
          'А',
          'а',
          'В',
          'С',
          'с',
          'Е',
          'е',
          'Н',
          'К',
          'к',
          'М',
          'О',
          'о',
          'Р',
          'р',
          'Т',
          'Х',
          'х',
          'у',
        ];
        sameCharEn.forEach((item, index) => {
          let re = new RegExp(item, 'g');
          // console.log(str);
          str = str.replace(re, sameCharRu[index]);
        });
        return str;
      }

      let i = 3;
      let row = worksheet.getRow(i).values;
      let siArray = [];
      let siObj = {};

      // while (String(row) !== '') {
      while (row.length !== 0) {
        console.log(i, row, String(row) == '', row[16]);
        if (row[6]) {
          row[6] = sameChar(row[6]);
        }
        if (row[18]) {
          row[18] = sameChar(row[18]);
        }
        if (row[26]) {
          row[26] = sameChar(row[26]);
        }
        if (row[31]) {
          row[31] = sameChar(row[31]);
        }
        if (row[37]) {
          row[37] = sameChar(row[37]);
        }
        siObj = {
          id: nanoid(),
          numTiShem60: { v: row[3], id: nanoid() },
          kodTi60: { v: 0, id: nanoid() },
          naimTi60: { v: row[4], id: nanoid() },
          tipSch60: { v: row[6], id: nanoid() },
          kanaly60: { v: row[7], id: nanoid() },
          tiAiis: { v: true, id: nanoid() },

          gr: { v: row[15], id: nanoid() },
          numTiSop: { v: row[16], id: nanoid() },

          naimTiSop: { v: row[17], id: nanoid() },
          naimTi80: { v: row[25], id: nanoid() },
          naimTi82: { v: row[29], id: nanoid() },

          numSchDB: { v: String(row[32]), id: nanoid() },
          numSchSop: { v: String(row[19]), id: nanoid() },
          numSchSch: { v: String(row[38]), id: nanoid() },

          tipSchSop: { v: row[18], id: nanoid() },
          tipSch80: { v: row[26], id: nanoid() },
          tipSchSch: { v: row[37], id: nanoid() },
          tipSchDB: { v: row[31], id: nanoid() },

          kttSop: { v: String(row[20]), id: nanoid() },
          kttDB: { v: String(row[33]), id: nanoid() },
          ktnSop: { v: String(row[21]), id: nanoid() },
          ktnDB: { v: String(row[34]), id: nanoid() },

          kodTi80: { v: row[24], id: nanoid() },
          kanaly80: { v: row[27], id: nanoid() },
        };

        let setX = new Set([
          siObj.tipSchSop.v,
          siObj.tipSch80.v,
          // siObj.tipSchDB.v,
          siObj.tipSchSch.v,
        ]);
        console.log(setX, setX.size);
        if (setX.size == 1) {
          siObj.tipSchSop.status = 'correct';
          siObj.tipSch80.status = 'correct';
          siObj.tipSchDB.status = 'correct';
          siObj.tipSchSch.status = 'correct';
        } else {
          siObj.tipSchSop.status = 'warning';
          siObj.tipSch80.status = 'warning';
          siObj.tipSchDB.status = 'warning';
          siObj.tipSchSch.status = 'warning';
        }
        setX = new Set([
          siObj.numSchSop.v,
          siObj.numSchDB.v,
          siObj.numSchSch.v,
        ]);
        console.log(setX, setX.size);
        if (setX.size == 1) {
          siObj.numSchSop.status = 'correct';
          siObj.numSchDB.status = 'correct';
          siObj.numSchSch.status = 'correct';
        } else {
          siObj.numSchSop.status = 'warning';
          siObj.numSchDB.status = 'warning';
          siObj.numSchSch.status = 'warning';
        }
        setX = new Set([siObj.ktnSop.v, siObj.ktnDB.v]);
        console.log(setX, setX.size);
        if (setX.size == 1) {
          siObj.ktnSop.status = 'correct';
          siObj.ktnDB.status = 'correct';
        } else {
          siObj.ktnSop.status = 'warning';
          siObj.ktnDB.status = 'warning';
        }
        setX = new Set([siObj.kttSop.v, siObj.kttDB.v]);
        console.log(setX, setX.size);
        if (setX.size == 1) {
          siObj.kttSop.status = 'correct';
          siObj.kttDB.status = 'correct';
        } else {
          siObj.kttSop.status = 'warning';
          siObj.kttDB.status = 'warning';
        }

        siArray.push(siObj);
        i++;
        row = worksheet.getRow(i).values;
      }
      console.log(siArray);
      setSiArrS(siArray);
    };
  };

  const [selectedSet, setSelectedSet] = useState(new Set());
  function tdOnClick(e) {
    console.log(
      e.target.id,
      e.target.getAttribute('colname'),
      e.target.parentNode.rowIndex
    );
    setSelectedSet(selectedSet.add(e.target.id));
    console.log('selectedSet', selectedSet, 'siArrS', siArrS);
    setCurrentID(e.target.id);
    // let siArrSMod = siArrS;
    let siArrSMod = siArrS.map((obj) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key].id == e.target.id) {
          obj[key].selected = 'selected';
        }
      });
      return obj;
    });
    console.log(siArrSMod);
    setSiArrS(siArrSMod);
  }

  function unSelectBtn() {
    // if (e.key === 'Escape') {
    // console.log(e.key);
    setSelectedSet(new Set());
    console.log('selectedSet', selectedSet, 'siArrS', siArrS);
    let siArrSmod2 = siArrS;
    siArrSmod2.map((obj) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key].selected) {
          obj[key].selected = '';
        }
      });
      return obj;
    });
    // console.log(siArrSMod);
    // setSiArrS(siArrSMod);
    // }
  }

  useEffect(() => {
    function NOOP() {}
    window.addEventListener('keyup', NOOP);
    return () => {
      window.removeEventListener('keydown', NOOP);
    };
  }, []);
  function markWarning() {
    console.log(siArrS);
    let siArrSMod = siArrS;
    siArrSMod = siArrSMod.map((obj) => {
      Object.keys(obj).forEach((key) => {
        // if (obj[key].id == currrentID) {
        if (selectedSet.has(obj[key].id)) {
          obj[key].status = 'warning';
        }
      });
      return obj;
    });
    console.log(siArrSMod);
    setSiArrS(siArrSMod);
  }

  function tdOnMD(e) {
    console.log(e);
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
      </header>
      <div>hi</div>
      <button onClick={fdel}>отправить данные на сервер!</button>
      <button onClick={markWarning}>Пометить как ошибка</button>
      <button onClick={unSelectBtn}>Снять выделение</button>
      <input type={'file'} onChange={readFile} />

      <table>
        <thead>
          <tr>
            <th>НаимТИ60_______</th>
            <th>КодТИ60</th>
            <th>ТипСч60</th>
            <th>каналы60</th>
            <th>ТИАиис</th>
            <th>ГРАИИС</th>
            <th>№ТИСоп</th>
            <th>НаимТИСоп______</th>
            <th>НаимТИ80_______</th>
            <th>НаимТИ82_______</th>

            <th>№СчСоп</th>
            <th>№СчБД</th>
            <th>№СчСч</th>

            <th>ТипСчСоп</th>
            <th>ТипСч80</th>
            <th>ТипСчСч</th>
            <th>ТипСчБД</th>

            <th>КттСоп</th>
            <th>КттБД</th>
            <th>КтнСоп</th>
            <th>КтнБД</th>

            <th>КодТИ80</th>
            <th>Каналы80</th>
          </tr>
        </thead>
        <tbody id='tbody1'>
          {siArrS.map((item) => (
            <tr key={item.kodTi80.v}>
              <td>{item.naimTi60?.v}</td>
              <td>{item.kodTi60?.v}</td>
              <td>{item.tipSch60?.v}</td>
              <td></td>
              <td>{item.tiAiis.v}</td>
              <td>{item.gr?.v}</td>
              <td>{item.numTiSop?.v}</td>
              <td
                id={item.naimTiSop?.id}
                onClick={tdOnClick}
                className={
                  item.naimTiSop?.status + ' ' + item.naimTiSop?.selected
                }
                colname={'naimTiSop'}
              >
                {item.naimTiSop?.v}
              </td>
              <td onMouseDown={tdOnMD}>{item.naimTi80?.v}</td>
              <td>{item.naimTi82?.v}</td>
              <td className={item.numSchSop?.status}>{item.numSchSop?.v}</td>
              <td className={item.numSchDB?.status}>{item.numSchDB?.v}</td>
              <td className={item.numSchSch?.status}>{item.numSchSch?.v}</td>
              <td className={item.tipSchSop?.status}>{item.tipSchSop?.v}</td>
              <td className={item.tipSch80?.status}>{item.tipSch80?.v}</td>
              <td className={item.tipSchSch?.status}>{item.tipSchSch?.v}</td>
              <td className={item.tipSchDB?.status}>{item.tipSchDB?.v}</td>
              <td className={item.kttSop?.status}>{item.kttSop?.v}</td>
              <td className={item.kttDB?.status}>{item.kttDB?.v}</td>
              <td className={item.ktnSop?.status}>{item.ktnSop?.v}</td>
              <td className={item.ktnDB?.status}>{item.ktnDB?.v}</td>
              <td>{item.kodTi80?.v}</td>
              <td className={item.kanaly80?.status}>{item.kanaly80?.v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
