import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'
import circular from './resourses/circular.gif'

export const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [article, setArticle] = useState({ Topic: "", Detail: "" })
  const [data, setData] = useState(null)
  const [startFirstQuery, setStartFirstQuery] = useState(false)

  const handleSearch = (e) => {
    const value = e.target.value.trimLeft()
    setSearchTerm(value)

    if (value === "") {
      setSearchResults([])
      console.log("Sin resultados")
    } else {
      const URL = `https://serviceone.onrender.com/apiWikiIdeasV1d/getPublication/${value}`
      const getTopics = async () => {
        setStartFirstQuery(true)
        /* Se realiza una petición para traer las coincidencias con la cadena ingresada en el input, el servidor responderá
        con un array de objetos, los cuales tienen un tópico y el número de docuemnto correspondiente. Si la api responde 
        con un array vacío significa que no encontró coincidencias*/
        const response = await fetch(URL)
        const data = await response.json()
        setData(data)
        setSearchResults(data)
      }
      getTopics()
    }
  }
  /*función que recibe el item recuperado en la renderización y ejecuta la consulta para traer 
  la publicación */
  const handleClick = (item) => {
    setStartFirstQuery(false)
    setData(null)

    const URL = `https://serviceone.onrender.com/apiWikiIdeasV1d/getPublicationbyNumDoc/${item.NumDoc}`
    const getPublication = async () => {
      const response = await fetch(URL)
      const data = await response.json()
      setArticle({ Topic: data[0].Topic, Detail: data[0].Detail })
      setSearchResults([])
      setSearchTerm('');

    }
    getPublication()
  }
  //Se implementará proximamente, falta el endpoint en el backend
  const handleSearchButton = () => {
    console.log("Pendiente de implementación", searchTerm)

  }
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", borderRadius: "1px", margin: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", width: "800px", height: "40px" }}>
          <div style={{ display: "flex", width: "70%", backgroundColor: "#1461bb", padding: "10px" }}>
            <input
              style={{ display: "flex", alignItems: "initial", width: "50%", height: "25px" }}
              name="control"
              type="text"
              autoComplete="off"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button onClick={() => handleSearchButton()}>
              <FaSearch />
            </button>
          </div>
          <div style={{
            zIndex: 2,
            backgroundColor: "#343434",
            width: "50%",
            borderRadius: "6px",
            position: "relative",
            top: "-2px"
          }}>
            {
              /*Se tuvieron que implementar los estados startFirstQuery y data para solucionar un bug que estaba ocurriendo,
              cuando el server presenta inactividad se suspende, eso hace que la primera consulta que realizamos demore unos cuantos 
              segundos, fue necesario implementar un circular progress bar para dar feedback al usuario,
              analizaré cómo mejorar este problema  */
              (startFirstQuery && !data) ?
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img src={circular} alt="circular" style={{ width: "35px", borderRadius: "90px" }} />
                </div> :
                searchResults.length > 0 && (
                  <>
                    <ul style={{ listStyleType: "none", margin: "3px" }}>
                      {
                        searchResults.map(item => (
                          <li key={item.NumDoc} onClick={() => { handleClick(item) }} style={{ backgroundColor: "white", margin: "3px", width: "70%", border: "none", textAlign: "left", cursor: "pointer" }}>
                            {item.Topic}
                          </li>)
                        )
                      }
                    </ul>
                  </>
                )
            }
          </div>
        </div >
        <div style={{
          position: "relative",
          zIndex: -4,
          marginTop: "20px",
          marginLeft: "15px",
        }}>
          <h5>{article.Topic}</h5>
          {article.Detail}
        </div>
      </div>
    </>
  );
}