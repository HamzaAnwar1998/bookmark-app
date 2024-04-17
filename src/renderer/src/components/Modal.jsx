/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Icon from 'react-icons-kit'
import { x } from 'react-icons-kit/feather/x'

// backshadow variants
const backVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
}

// modal variants
const modalVariants = {
  hidden: {
    scale: 0
  },
  visible: {
    scale: 1,
    transition: {
      duration: 0.5
    }
  }
}

const Modal = ({
  setModal,
  addItemLoading,
  setAddItemLoading,
  invalidURL,
  setInvalidURL,
  items
}) => {
  // states
  const [url, setUrl] = useState('')

  // ref
  const urlRef = useRef(null)

  // focus input on component mount
  useEffect(() => {
    urlRef.current.focus()
  }, [])

  // form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    setAddItemLoading(true)
    window.electron.ipcRenderer.send('new-item', { url, items })
  }

  return (
    <AnimatePresence>
      <motion.div className="backdrop" variants={backVariants} initial="hidden" animate="visible">
        <motion.div className="modal" variants={modalVariants} initial="hidden" animate="visible">
          <div className="modal-header">
            <h5>Add Items</h5>
            <button
              type="button"
              onClick={() => {
                setInvalidURL(false)
                setModal(false)
              }}
              disabled={addItemLoading}
            >
              <Icon icon={x} size={16} />
            </button>
          </div>
          <div className="modal-body">
            <form className="custom-form" onSubmit={handleSubmit}>
              <label htmlFor="url" className="url-label">
                URL
              </label>
              <input
                type="url"
                placeholder="Enter URL"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                ref={urlRef}
              />
              {invalidURL && <div className="error-msg">{invalidURL}</div>}
              <div className="submit-and-cancel-div">
                <button
                  type="button"
                  className="cancel"
                  onClick={() => {
                    setInvalidURL(false)
                    setModal(false)
                  }}
                  disabled={addItemLoading}
                >
                  CANCEL
                </button>
                <button type="submit" className="submit" disabled={addItemLoading}>
                  {addItemLoading ? 'ADDING...' : 'ADD'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Modal
