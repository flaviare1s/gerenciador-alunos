import { Header } from "./components/Header"
import { PageProvider } from "./contexts/PageContext"
import { AppRoutes } from "./routes/AppRoutes"

function App() {

  return (
    <PageProvider>
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
