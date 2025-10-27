import { lazy, Suspense } from 'react'
import { useLocation } from './hooks/useClient'
import { TranslationProvider } from './contexts/TranslationProvider'
import { DEFAULT_THEME, ThemeProvider } from '@zendeskgarden/react-theming'

const TicketSidebar = lazy(() => import('./locations/TicketSidebar'))

const LOCATIONS = {
  ticket_sidebar: TicketSidebar,
  default: () => null
}

function App() {
  const location = useLocation()
  const Location = LOCATIONS[location] || LOCATIONS.default

  return (
    <ThemeProvider theme={DEFAULT_THEME}>
      <TranslationProvider>
        <Suspense fallback={<span>Loading...</span>}>
          <Location />
        </Suspense>
      </TranslationProvider>
    </ThemeProvider>
  )
}

export default App
