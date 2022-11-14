import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { nanoid } from 'nanoid';
import Selectable from 'selectable.js';
import { readXlsx } from './readXlsx.js';

function App() {
  const [siState, setSiState] = useState([]);
  const [appState, setAppState] = useState({});

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

  const readFileXlsx = async (e) => {
    let data = await readXlsx(e);
    setSiState(data);
  };
  const [selectedSet, setSelectedSet] = useState(new Set());
  function tdOnClick(e) {
    /*
    console.log(
      e.target.id,
      e.target.getAttribute('colname'),
      e.target.parentNode.rowIndex
    );
    setSelectedSet(selectedSet.add(e.target.id));
    console.log('selectedSet', selectedSet, 'siState', siState);
    setCurrentID(e.target.id);
    // let siStateMod = siState;
    let siStateMod = siState.map((obj) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key].id == e.target.id) {
          obj[key].selected = 'selected';
        }
      });
      return obj;
    });
    console.log(siStateMod);
    setSiState(siStateMod);
    */
  }

  function tdOnClick2(e) {
    let colname = e.target.getAttribute('colname');
    let rowIndex = e.target.parentNode.rowIndex;
    console.log(e.target.id, colname, rowIndex);
    setAppState({
      ...appState,
      selectedCell: {
        rowIndex: e.target.parentNode.rowIndex,
        colname: e.target.getAttribute('colname'),
      },
    });
    console.log('appState', appState);

    let siArrMod = [...siState];
    siArrMod.map((obj) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key].selected) {
          obj[key].selected = '';
        }
        if (obj[key].id === e.target.id) {
          obj[key].selected = 'selected';
        }
      });
      return obj;
    });
    console.log(siArrMod);
    // siArrMod[index - 1][colname].selected = 'selected';
    setSiState(siArrMod);
  }

  function unSelectBtn() {
    // if (e.key === 'Escape') {
    // console.log(e.key);
    setSelectedSet(new Set());
    console.log('selectedSet', selectedSet, 'siState', siState);
    let siStatemod2 = siState;
    siStatemod2.map((obj) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key].selected) {
          obj[key].selected = '';
        }
      });
      return obj;
    });
    // console.log(siStateMod);
    // setSiState(siStateMod);
    // }
  }

  useEffect(() => {
    function selectMany(e) {
      let nextArrIndex = appState.selectedCell.rowIndex;
      let colname = appState.selectedCell.colname;
      if (e.shiftKey && e.code === 'ArrowDown') {
        if (siState.length > nextArrIndex) {
          setSiState((siStatePrev) => {
            siStatePrev[nextArrIndex][colname].selected = 'selected';
            return siStatePrev;
          });
          setAppState({
            ...appState,
            selectedCell: {
              rowIndex: nextArrIndex + 1,
              colname: colname,
            },
          });
        }
      }

      if (e.shiftKey && e.code === 'ArrowUp') {
        if (nextArrIndex > 1) {
          nextArrIndex = appState.selectedCell.rowIndex;

          setSiState((siStatePrev) => {
            siStatePrev[nextArrIndex - 1][colname].selected = '';
            return siStatePrev;
          });
          setAppState({
            ...appState,
            selectedCell: {
              rowIndex: nextArrIndex - 1,
              colname: colname,
            },
          });
        }
      }
    }
    const tbody1 = document.getElementById('tbodyId1');
    tbody1.addEventListener('keydown', selectMany);
    return () => {
      tbody1.removeEventListener('keydown', selectMany);
    };
  }, [appState, siState]);

  function markWarning() {
    console.log(siState);
    let siStateMod = [...siState];
    siStateMod = siStateMod.map((obj) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key].selected === 'selected') {
          obj[key].status = 'warning';
        }
      });
      return obj;
    });
    console.log(siStateMod);
    setSiState(siStateMod);
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
      <input type={'file'} onChange={readFileXlsx} />

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
        <tbody id='tbodyId1' onClick={tdOnClick2} tabIndex='0'>
          {siState.map((item) => {
            let tdContent = Object.keys(item).map((param) => {
              if (param === 'id') return null;
              return (
                <td
                  key={item[param].id}
                  id={item[param].id}
                  colname={param}
                  className={item[param].status + ' ' + item[param].selected}
                >
                  {item[param].v}
                </td>
              );
            });
            return <tr key={item.kodTi80.v}>{tdContent}</tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;

/*
<tr key={item.kodTi80.v}>
  <td
    colname={'naimTi60'}
    className={
      item.naimTi60?.status + ' ' + item.naimTi60?.selected
    }
  >
    {item.naimTi60?.v}
  </td>
  <td
    colname={'kodTi60'}
    className={item.kodTi60?.status + ' ' + item.kodTi60?.selected}
  >
    {item.kodTi60?.v}
  </td>
  <td
    colname={'tipSch60'}
    className={
      item.tipSch60?.status + ' ' + item.tipSch60?.selected
    }
  >
    {item.tipSch60?.v}
  </td>
  <td
    colname={'kanaly60'}
    className={
      item.kanaly60?.status + ' ' + item.kanaly60?.selected
    }
  ></td>
  <td
    colname={'tiAiis'}
    className={item.tiAiis?.status + ' ' + item.tiAiis?.selected}
  >
    {item.tiAiis.v}
  </td>
  <td
    colname={'gr'}
    className={item.gr?.status + ' ' + item.gr?.selected}
  >
    {item.gr?.v}
  </td>
  <td
    colname={'numTiSop'}
    className={
      item.numTiSop?.status + ' ' + item.numTiSop?.selected
    }
  >
    {item.numTiSop?.v}
  </td>
  <td
    colname={'naimTiSop'}
    id={item.naimTiSop?.id}
    className={
      item.naimTiSop?.status + ' ' + item.naimTiSop?.selected
    }
  >
    {item.naimTiSop?.v}
  </td>
  <td colname={'naimTi80'} onMouseDown={tdOnMD}>
    {item.naimTi80?.v}
  </td>
  <td colname={'naimTi82'}>{item.naimTi82?.v}</td>
  <td colname={'numSchSop'} className={item.numSchSop?.status}>
    {item.numSchSop?.v}
  </td>
  <td colname={'numSchDB'} className={item.numSchDB?.status}>
    {item.numSchDB?.v}
  </td>
  <td colname={'numSchSch'} className={item.numSchSch?.status}>
    {item.numSchSch?.v}
  </td>
  <td colname={'tipSchSop'} className={item.tipSchSop?.status}>
    {item.tipSchSop?.v}
  </td>
  <td colname={'tipSch80'} className={item.tipSch80?.status}>
    {item.tipSch80?.v}
  </td>
  <td colname={'tipSchSch'} className={item.tipSchSch?.status}>
    {item.tipSchSch?.v}
  </td>
  <td colname={'tipSchDB'} className={item.tipSchDB?.status}>
    {item.tipSchDB?.v}
  </td>
  <td colname={'kttSop'} className={item.kttSop?.status}>
    {item.kttSop?.v}
  </td>
  <td colname={'kttDB'} className={item.kttDB?.status}>
    {item.kttDB?.v}
  </td>
  <td colname={'ktnSop'} className={item.ktnSop?.status}>
    {item.ktnSop?.v}
  </td>
  <td colname={'ktnDB'} className={item.ktnDB?.status}>
    {item.ktnDB?.v}
  </td>
  <td colname={'kodTi80'}>{item.kodTi80?.v}</td>
  <td colname={'kanaly80'} className={item.kanaly80?.status}>
    {item.kanaly80?.v}
  </td>
</tr>
))}
*/
