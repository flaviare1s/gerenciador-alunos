import logo from "../assets/img/Logo.png"

export const Header = () => {
  return (
    <header className="bg-primary">
      <div className="py-[18px] px-[42px] flex justify-between items-center">
        <div className="flex items-center gap-[25px]">
          <img src={logo} alt="Logo" />
          <h1 className="text-white font-extrabold tracking-[1%] leading-[30px]">Gerenciador de alunos</h1>
        </div>
      </div>
    </header>
  )
}
