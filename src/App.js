import React, {useState, useEffect} from "react"
import "./App.css";
let CryptoJS = require("crypto-js"
)
function App() {
  const alphabetVisionare = 'abcdefghijklmnopqrstuvwxyz'
  let visionare = new Map()

  const [textOrigin, setTextOrigin] = useState('')
  const [textVisionare, setTextVisionare] = useState('')
  const [textFeistel, setTextFeistel] = useState('')
  const [textDFeistel, setTextDFeistel] = useState('')
  const [key, setKey] = useState('A')


  useEffect(() => {
    if(key !== '' && key.match(/[A-Z]/i))
      shifrVisionare(textOrigin)
  }, [key])
  useEffect(() => {
    if(textVisionare !== '')
      shifrFeistel(textVisionare)
  }, [textVisionare])
  function keyChanged(e) {
    if(e.target.value.length <= 1)
      setKey(e.target.value.toUpperCase())
  }
  useEffect(() => {
    if(textFeistel !== '')
      decryptFeistel(textFeistel)
  }, [textFeistel])

  function fileLoad(e) {
      let file = e.target.files[0]
      if(file === undefined)
        return
      let reader = new FileReader()
      reader.readAsText(file)

      reader.onload = () => {
        setTextOrigin(reader.result)
        if(key !== '')
          shifrVisionare(reader.result)
      }
  }
  function alphabetGenerate() {
    for(let x of alphabetVisionare) {
      let y = new Map()
      let count = alphabetVisionare.indexOf(x)
      for(let i = 0; i < alphabetVisionare.length; i++) {
        if(count === alphabetVisionare.length)
          count = 0
        y.set(alphabetVisionare[i].toUpperCase(), alphabetVisionare[count].toUpperCase())
        count++
      }
      visionare.set(x.toUpperCase(), y)
    }
  }
  function shifrVisionare(text) {
    alphabetGenerate() 
    text = text.split('').map(e => {
      if(e.match(/[A-Z]/i))
        if(e === e.toUpperCase())
          return visionare.get(e.toUpperCase()).get(key)
        else
          return visionare.get(e.toUpperCase()).get(key).toLowerCase()
      else return e
    }).join('')
    setTextVisionare(text)
  }
  function shifrFeistel(text) {
    let keyHex = CryptoJS.enc.Utf8.parse(key.repeat(3))
    let encrypted = CryptoJS.DES.encrypt(text, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    setTextFeistel(encrypted.toString())
  }
  function decryptFeistel(text) {
    let keyHex = CryptoJS.enc.Utf8.parse(key.repeat(3))
    let decrypted = CryptoJS.DES.decrypt({
      ciphertext: CryptoJS.enc.Base64.parse(text)
    }, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    setTextDFeistel(decrypted.toString(CryptoJS.enc.Utf8))
  }

  return (
    
    <section>
      <h1>ПИ-18а 13 Вариант (Виженер + Фейстель)</h1>
      <h2>Шифрование Вижинера</h2>
      <form>
        <label htmlFor="file">Choose file to upload</label>
        <input id="file" name="fasf" type="file" accept=".txt" onChange={fileLoad}></input>
        <br/>
        <label htmlFor="text">Key</label>
        <input id="text"type="text" value={key} onChange={keyChanged}></input>
      </form>
      <label htmlFor="origin"> Original Text:  </label>
      <textarea id="origin" value={textOrigin} readOnly className="text"></textarea>
      <label htmlFor="visionare"> Visionare:  </label>
      <textarea id="visionare" value={textVisionare} readOnly className="text"></textarea>
      <hr/>
      <h2>Шифрование Фейстеля</h2>
      <label htmlFor="feistel">  FeisteL: </label>
      <textarea id="feistel" value={textFeistel} readOnly className="text"></textarea>
      <label htmlFor="dfeistel">  Decrypt FeisteL: </label>
      <textarea id="dfeistel" value={textDFeistel} readOnly className="text"></textarea>
    </section>
  );
}

export default App;
