import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppShell from './components/layout/AppShell'
import Overview from './views/Overview'
import ClientsList from './views/ClientsList'
import ClientDetail from './views/ClientDetail'
import CardsList from './views/CardsList'
import CardDetail from './views/CardDetail'
import PhoneLookup from './views/PhoneLookup'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const e = error as { isRateLimit?: boolean }
        if (e.isRateLimit) return failureCount < 3
        return failureCount < 1
      },
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Overview />} />
            <Route path="customers" element={<ClientsList />} />
            <Route path="customers/:id" element={<ClientDetail />} />
            <Route path="cards" element={<CardsList />} />
            <Route path="cards/:cardNumber" element={<CardDetail />} />
            <Route path="lookup" element={<PhoneLookup />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
