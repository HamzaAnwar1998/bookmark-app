import { useEffect, useState } from 'react'
import Header from './components/Header'
import Items from './components/Items'
import Modal from './components/Modal'

function App() {
  // states
  const [modal, setModal] = useState(false)
  const [addItemLoading, setAddItemLoading] = useState(false)
  const [items, setItems] = useState([])

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
        setModal={setModal}
        items={items}
        setItems={setItems}
      />
      {modal && (
        <Modal
          setModal={setModal}
          addItemLoading={addItemLoading}
          setAddItemLoading={setAddItemLoading}
        />
      )}
    </div>
  )
}

export default App
