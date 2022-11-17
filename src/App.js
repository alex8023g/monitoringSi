import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { nanoid } from 'nanoid';
import Selectable from 'selectable.js';
import { readXlsx } from './readXlsx.js';
import { colFullName, colOrderObj } from './constants.js';

function App() {
  const [siState, setSiState] = useState([]);
  const [appState, setAppState] = useState({
    selectedCell: {},
    colOrderOpt: 'opt1',
    colOrder: colOrderObj.opt1,
  });

  let sechID;
  useEffect(() => {
    console.log(document.URL, window.location.search);
    let url = new URL(document.URL);
    sechID = url.searchParams.get('sechID');
    console.log(sechID);
  }, []);

  const saveSiData = async () => {
    let sechId = {};
    sechId.id = sechID;
    console.log(`sechId`, sechId);

    let delSech = await fetch(`http://localhost:8080/api/savesidata`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify('sechId'),
    });

    delSech.json();
    console.log(`/api/savesidata`, delSech);
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
    setSiState((state) => {
      return state.map((obj) => {
        Object.keys(obj).forEach((key) => {
          if (obj[key].selected === 'selected') {
            obj[key].status = 'warning';
          }
        });
        return obj;
      });
    });
  }

  function markCorrect() {
    setSiState((state) => {
      return state.map((obj) => {
        Object.keys(obj).forEach((key) => {
          if (obj[key].selected === 'selected') {
            obj[key].status = 'correct';
          }
        });
        return obj;
      });
    });
  }

  function handleRadioBtn(e) {
    console.log(e.target.value);
    setAppState({
      ...appState,
      colOrderOpt: e.target.value,
      colOrder: colOrderObj[e.target.value],
    });
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
      </header>
      <div>hi</div>
      <button onClick={saveSiData}>отправить данные на сервер!</button>
      <button onClick={markWarning}>Пометить как ошибка</button>
      <button onClick={markCorrect}>Пометить как корр</button>
      <input id='input-xlsx' type={'file'} onChange={readFileXlsx} />
      <input
        id='radioBtnId1'
        type='radio'
        name='colOrder'
        value='opt1'
        checked={appState.colOrderOpt === 'opt1'}
        onChange={handleRadioBtn}
      />
      <label for='radioBtnId1'>вар1</label>
      <input
        id='radioBtnId2'
        type='radio'
        name='colOrder'
        value='opt2'
        checked={appState.colOrderOpt === 'opt2'}
        onChange={handleRadioBtn}
      />
      <label for='radioBtnId2'>вар2</label>
      <table>
        <thead>
          <tr>
            {appState.colOrder.map((param) => (
              <th key={nanoid()}>{colFullName[param]}</th>
            ))}
          </tr>
        </thead>
        <tbody id='tbodyId1' onClick={tdOnClick2} tabIndex='0'>
          {siState.map((item) => {
            let tdContent = appState.colOrder.map((param) => {
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
