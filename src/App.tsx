import React from 'react';
import logo from './logo.svg';
import './App.css';
import ItemList from './components/item'

import xml2js from 'xml2js'


function App() {
  var parser = new xml2js.Parser();

  const [done, setDone] = React.useState(false)

  const [lager, setLager] = React.useState()
  const [bevaka, setBevaka] = React.useState([])
  const [lista, setLista] = React.useState<any[]>([])

  const readLagerFile = async (e: any) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target && e.target.result)
      if(text !== null) {
        parser.parseString(text, function (err: any, result: any) {
            setLager(result)
        })
      }
    }
    reader.readAsText(e.target.files[0])
  }

  const readBevakaFile = async (e: any) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target && e.target.result as string)
      let items = [];
      if(text !== null) {
        const rows = text.split("\n")
        const rowsWithoutHeaders = rows.slice(1)
        for(const item of rowsWithoutHeaders) {
          const itemArr = item.split(",")
          const itemObj = {
            artnr: itemArr[0],
            min: itemArr[1]
          }
          items.push(itemObj)
        }
        //@ts-ignore
        setBevaka(items)
      }
    }
    console.log("e.target.files[0]",e.target.files[0])
    reader.readAsText(e.target.files[0])
  }

  const checkMinValue = () => {
    console.log("MAKE THE CHECK")
    //@ts-ignore
    const filtered = lager.data.artikel.filter(art => bevaka.find(bart => art.artnr[0] === bart.artnr && Number.parseInt(art.ilager) < Number.parseInt(bart.min)))

    const filteredWithMin = filtered.map((item: any) => {
      //@ts-ignore
      const min = bevaka.find((bart) => item.artnr[0] === bart.artnr).min
      return {
        ...item,
        min
      }
    })
    setLista(filteredWithMin)
  }

  console.log("LAGER", lager)
  //@ts-ignore
  if(!done && lager && lager.data && lager.data.artikel.length > 0 && bevaka.length > 0) {
    checkMinValue()
    setDone(true)
  }
  
  console.log("lager & baevaka", bevaka, lista)

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <label>XML</label><input type="file" onChange={(e) => readLagerFile(e)} />
          <label>CSV</label><input type="file" onChange={(e) => readBevakaFile(e)} />
        </div>
      </header>
      { 
        <ItemList lista={lista} />
      }
    </div>
  );
}

export default App;

