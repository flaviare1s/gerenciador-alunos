import { Header } from "./components/Header"
import { AppRoutes } from "./components/AppRoutes"

function App() {

  return (
    <div className="font-montserrat">
      <Header />
      <main>
        <AppRoutes />
      </main>
    </div>
  )
}

export default App
