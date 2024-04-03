/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'

const Items = ({ setAddItemLoading, setModal, items, setItems }) => {
  // get newly added item
  useEffect(() => {
    window.electron.ipcRenderer.on('new-item-success', (e, args) => {
      setItems((prevItems) => {
        const updatedItems = [args, ...prevItems]
        saveItemsToLocalStorage(updatedItems)
        return updatedItems
      })
      setAddItemLoading(false)
      setModal(false)
    })

    // Effect cleanup
    return () => {
      window.electron.ipcRenderer.removeAllListeners('new-item-success')
    }
  }, [])

  // save items to LS
  const saveItemsToLocalStorage = (items) => {
    localStorage.setItem('items', JSON.stringify(items))
  }

  // Initially selecting the first item
  const [selectedIndex, setSelectedIndex] = useState(0)

  // item click
  const handleItemClick = (index) => {
    setSelectedIndex(index)
  }

  // arrow up and down item's navigation
  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp') {
        setSelectedIndex((prevIndex) => Math.max(0, prevIndex - 1))
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex((prevIndex) => Math.min(items.length - 1, prevIndex + 1))
      }
    }

    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [selectedIndex, items])

  // open item
  const handleItemOpen = (url) => {
    openURLInNewWindow(url)
  }

  // open item on enter
  // useEffect(() => {
  //   const handleEnter = (e) => {
  //     if (e.key === 'Enter') {
  //       const selectedItem = items[selectedIndex]
  //       if (selectedItem) {
  //         openURLInNewWindow(selectedItem.url)
  //       }
  //     }
  //   }
  //   document.addEventListener('keyup', handleEnter)

  //   return () => {
  //     document.removeEventListener('keyup', handleEnter)
  //   }
  // }, [selectedIndex, items])

  // open remote content url in new window
  const openURLInNewWindow = (url) => {
    window.open(
      url,
      '',
      `
      maxWidth=2000;
      maxHeight=2000
      width=1200;
      height=800;
      contextIsolation=1;
      nodeIntegration=0;
    `
    )
    // use reader.js here
  }

  return (
    <div className="items-container">
      {items.length > 0 ? (
        <>
          {items.map((item, index) => (
            <div
              className={`item ${index === selectedIndex ? 'selected' : ''}`}
              key={item.id}
              onClick={() => handleItemClick(index)}
              onDoubleClick={() => handleItemOpen(item.url)}
            >
              <div className="img">
                {item.ss ? <img src={item.ss} alt={item.title} /> : <span>{item.err}</span>}
              </div>
              <div className="content">
                <p>{item.title}</p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="info-msg">No Item Found</div>
      )}
    </div>
  )
}

export default Items
