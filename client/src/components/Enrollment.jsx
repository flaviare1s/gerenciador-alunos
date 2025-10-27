import { LiaPlusCircleSolid } from "react-icons/lia"

export const Enrollment = ({ cursos, todosCursos, setCursoSelecionado, setDataConclusao, submitting, cursoSelecionado, dataConclusao, handleAddCurso }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4 w-full">
      <div className="flex-1 md:flex-3">
        <label className="text-sm font-medium text-neutral-black" htmlFor="curso">
          Curso
        </label>
        <select
          id="curso"
          name="curso"
          value={cursoSelecionado}
          onChange={(e) => setCursoSelecionado(e.target.value)}
          className="text-gray-medium w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input mt-2"
          disabled={submitting}
        >
          <option value="">Selecione uma opção</option>
          {cursos
            .filter(c => !todosCursos.some(cm => cm.id === c.id))
            .map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))
          }
        </select>
      </div>

      <div className="flex items-end gap-4 flex-1">
        <div className="flex-1">
          <label className="text-sm font-medium text-neutral-black" htmlFor="dataConclusao">
            Data de Conclusão
          </label>
          <input
            type="date"
            id="dataConclusao"
            name="dataConclusao"
            value={dataConclusao}
            onChange={(e) => setDataConclusao(e.target.value)}
            className="text-gray-medium w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input mt-2"
            disabled={submitting}
          />
        </div>

        <button
          type="button"
          onClick={handleAddCurso}
          disabled={submitting}
          className="flex items-center justify-center cursor-pointer disabled:opacity-50"
          style={{ height: "30px", width: "30px" }}
        >
          <LiaPlusCircleSolid className="w-full h-full -mt-5" />
        </button>
      </div>
    </div>
  )
}
