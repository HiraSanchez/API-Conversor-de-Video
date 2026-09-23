import { MotionConfig } from 'framer-motion'
import { BrowserRouter } from 'react-router'
import { Shell } from './Shell'

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </MotionConfig>
  )
}
