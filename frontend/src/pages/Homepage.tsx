import React from 'react'
import { Link } from 'react-router-dom'

const Homepage: React.FC = () => {
  return (
    <div>Homepage
      <Link to={'/test/anotherpage?someval=2'}> test </Link>
    </div>
  )
}

export default Homepage