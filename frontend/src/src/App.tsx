import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function App() {

  return (
     <div className='h-full w-full'>
        <RouterProvider router={router} />
     </div>
  )
}

export default App
