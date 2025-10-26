import { Header } from "./components/Header"
import { AppRoutes } from "./routes/AppRoutes"

function App() {

  return (
    <div className="font-montserrat">
      <Header />
      <main className="max-w-[1086px] mx-auto pt-[60px] pb-[42px] px-4">
        <AppRoutes />
      </main>
    </div>
  )
}

export default App
