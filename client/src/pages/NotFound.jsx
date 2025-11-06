import { Link } from "react-router-dom"
export const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center text-center px-4 py-10 mt-14">
      <h2 className="text-primary text-5xl md:text-7xl font-bold py-2">404</h2>
      <p className="sm:text-lg">Página não encontrada!</p>
      <p className="text-sm sm:text-base py-2">Desculpe, a página que você está procurando não existe.</p>
      <Link className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 mt-5 text-sm" to="/">Voltar para a página inicial</Link>
    </div>
  )
}
