import { FiTrash2 } from "react-icons/fi";
import check from "../assets/img/Check.png";

export const AlunoCurso = ({ todosCursos, handleRemoveCurso, handleUpdateCurso, isCreateMode }) => {
  return (
    <div>
      {todosCursos.length > 0 && (
        <div className="flex flex-col gap-4 w-full mb-[26px]">
          {todosCursos.map((curso, index) => (
            <div key={curso.matriculaId || curso.id || index} className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 md:flex-3 relative">
                <select
                  disabled
                  className="text-gray-medium w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input appearance-none bg-white"
                >
                  <option>{curso.nome}</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveCurso(curso.id, curso.matriculaId)}
                  className="flex items-center justify-center text-primary cursor-pointer absolute right-3 top-2.5 center"
                  style={{ width: "30px", height: "30px" }}
                  title="Remover curso"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 flex-1">
                <div className="flex-1 relative">
                  <input
                    type="date"
                    defaultValue={curso.dataConclusao || ""}
                    onChange={(e) => {
                      if (!isCreateMode) {
                        handleUpdateCurso(
                          curso.matriculaId,
                          curso.id,
                          e.target.value
                        );
                      }
                    }}
                    disabled={isCreateMode}
                    className="text-gray-medium w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center" style={{ width: "30px", height: "30px" }}>
                    <img className="w-6 h-6" src={check} alt="Check" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
