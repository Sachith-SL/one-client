import { useState, useEffect } from 'react'
import { getWelcomeMessage } from '../services/HomeService';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getWelcomeMessage()
      .then((data: string) => {
        setMessage(data)
        setLoading(false)
      })
      .catch((error: unknown) => {
        console.error("Error:", error)
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <h1>
        {loading ? 'Loading...' : message}
      </h1>
      <button className='btn btn-info me-2' onClick={() => navigate("/employee-list")}>Employee List</button>
            <button className='btn btn-primary me-2' onClick={() => navigate("/create-employee")}>Create New</button>
    </div>
  )
}

export default Home
