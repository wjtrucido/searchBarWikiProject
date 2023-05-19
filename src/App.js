import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import circular from './resourses/circular.gif';

export const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [article, setArticle] = useState({ topic: "", detail: null });
  const [data, setData] = useState();

  const getTopics = async () => {
    setData(null);
    const response = await fetch(`https://serviceone.onrender.com/api-wiki-ideas/publications-by-string/${searchTerm}`);
    const data = await response.json();
    setSearchResults(data);
    setData(data);
  }
  /* Búsqueda de sugerencias */
  useEffect(() => {
    getTopics();
  }, [searchTerm]);

  /* Trae la publicación seleccionada */
  const handleClick = async (item) => {
    setSelected(item);
    setData(null);
  }
  useEffect(() => {
    const getPublication = async () => {
      if (selected) {
        const response = await fetch(`https://serviceone.onrender.com/api-wiki-ideas/publication-by-number/${selected.numberPublication}`);
        const data = await response.json();
        setArticle({ topic: data.publication.topic, detail: data.publication.detail });
        setSearchResults([]);
        setSearchTerm('');
      }
    }
    getPublication();
  }, [selected]);

  //Se implementará proximamente, falta el endpoint en el backend.
  const handleSearchButton = () => {
    console.log("Pendiente de implementación", searchTerm);

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
              onChange={(e) => setSearchTerm(e.target.value.trimStart())}
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
              (data === null) ?
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img src={circular} alt="circular" style={{ width: "35px", borderRadius: "90px" }} />
                </div> :
                searchResults.length > 0 && (
                  <>
                    <ul style={{ listStyleType: "none", margin: "3px" }}>
                      {
                        searchResults.map(item => (
                          <li key={item.numberPublication} onClick={() => { handleClick(item) }} style={{ backgroundColor: "white", margin: "3px", width: "70%", border: "none", textAlign: "left", cursor: "pointer" }}>
                            {item.topic}
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
          <h5>{article.topic}</h5>
          {article.detail}
        </div>
      </div>
    </>
  )
}