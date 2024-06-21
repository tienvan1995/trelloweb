import { useState } from 'react'
import Board from './pages/Boards/_id'
import LoginForm from './pages/User/LoginForm'

function App() {
  const [activeLoginForm, setActiveLoginForm] = useState(true)
  const toggleLoginForm = () => {setActiveLoginForm(false)}
  return (
    <>
      {activeLoginForm
        ? <LoginForm offLogin={toggleLoginForm} />
        :<Board/>
      }
    </>
  )
}
export default App
