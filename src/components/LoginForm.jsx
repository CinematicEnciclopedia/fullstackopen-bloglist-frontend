import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const success = await onLogin({ username, password })
    if (success) {
      setUsername('')
      setPassword('')
      navigate('/')
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>
        <label>
          username
          <input
            id="username"
            name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            autoComplete="username"
          />
        </label>
        <label>
          password
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            autoComplete="current-password"
          />
        </label>
        <button type="submit" className="primary">login</button>
      </form>
    </div>
  )
}

export default LoginForm
