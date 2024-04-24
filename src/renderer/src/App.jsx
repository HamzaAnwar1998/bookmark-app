import { useEffect, useState } from 'react'
import Header from './components/Header'
import Items from './components/Items'
import Modal from './components/Modal'

function App() {
  // states
  const [modal, setModal] = useState(false)
  const [addItemLoading, setAddItemLoading] = useState(false)
  const [items, setItems] = useState([])
  const [invalidURL, setInvalidURL] = useState(null)

  // get all items from LS
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('items'))
    if (items) {
      setItems(items)
    }
  }, [])

  return (
    <div className="wrapper">
      <Header setModal={setModal} setItems={setItems} />
      <Items
        setAddItemLoading={setAddItemLoading}
        modal={modal}
        setModal={setModal}
        items={items}
        setItems={setItems}
        setInvalidURL={setInvalidURL}
      />
      {modal && (
        <Modal
          setModal={setModal}
          addItemLoading={addItemLoading}
          setAddItemLoading={setAddItemLoading}
          invalidURL={invalidURL}
          setInvalidURL={setInvalidURL}
          items={items}
        />
      )}
    </div>
  )
}

export default App
