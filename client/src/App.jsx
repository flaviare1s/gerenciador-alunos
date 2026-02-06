import { useState, useEffect } from "react"
import { Toaster } from "react-hot-toast"
import { Header } from "./components/Header"
import { PageProvider } from "./contexts/PageContext"
import { AppRoutes } from "./routes/AppRoutes"
import { DatabasePausedModal } from "./components/DatabasePausedModal"

function App() {
  const [showDatabaseModal, setShowDatabaseModal] = useState(false)

  useEffect(() => {
    // Exibe o modal ao carregar a aplicação
    setShowDatabaseModal(true)
  }, [])

  return (
    <PageProvider>
      <Toaster position="top center" />
      <DatabasePausedModal
        isOpen={showDatabaseModal}
        onClose={() => setShowDatabaseModal(false)}
      />
      <div className="font-montserrat">
        <Header />
        <main className="max-w-[1086px] mx-auto pt-[60px] pb-[42px] px-4">
          <AppRoutes />
        </main>
      </div>
    </PageProvider>
  )
}

export default App
