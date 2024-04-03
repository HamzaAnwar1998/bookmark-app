import { useState } from 'react'

/* eslint-disable react/prop-types */
const Header = ({ setModal, setItems }) => {
  // states
  const [query, setQuery] = useState('')
  const [timer, setTimer] = useState(null)

  // search
  const handleSearch = (value) => {
    setQuery(value)
    if (timer) {
      clearTimeout(timer)
    }
    const newTimer = setTimeout(() => {
      const matchedItems = JSON.parse(localStorage.getItem('items')).filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      )
      setItems(matchedItems)
    }, 2000)
    setTimer(newTimer)
  }

  return (
    <>
      <div className="input-div">
        <button type="button" onClick={() => setModal(true)}>
          ADD
        </button>
        <input
          type="text"
          placeholder="Search by title"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </>
  )
}

export default Header
