import { useEffect, useState } from "react";
import { LiaPlusCircleSolid } from "react-icons/lia";
import check from "../assets/img/Check.png";
import { createMatricula } from "../services/aluno-curso";
import { getAlunoById } from "../services/aluno";
import { toast } from "react-hot-toast";

export const AlunoCursosManager = ({ alunoId, cursos, isCreateMode = false }) => {
  const [cursosMatriculados, setCursosMatriculados] = useState([]);
  const [cursosPendentes, setCursosPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursoSelecionado, setCursoSelecionado] = useState("");
  const [dataConclusao, setDataConclusao] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (alunoId) {
      setLoading(true);
      getAlunoById(alunoId)
        .then((data) => {
          setCursosMatriculados(data.cursos || []);
        })
        .catch((error) => {
          console.error("Erro ao buscar cursos do aluno:", error);
          toast.error("Erro ao carregar cursos do aluno");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [alunoId]);

  const handleAddCurso = async () => {
    if (!cursoSelecionado) {
      toast.error("Selecione um curso");
      return;
    }

    if (isCreateMode) {
      const novoCurso = cursos.find(c => c.id === parseInt(cursoSelecionado));

      if (novoCurso) {
        setCursosPendentes([
          ...cursosPendentes,
          {
            id: novoCurso.id,
            nome: novoCurso.nome,
            dataConclusao: dataConclusao || null
          }
        ]);

        setCursoSelecionado("");
        setDataConclusao("");
        toast.success("Curso adicionado! Salve o aluno para confirmar a matrícula.");
      }
      return;
    }

    const payload = {
      alunoId: parseInt(alunoId),
      cursoId: parseInt(cursoSelecionado),
      dataConclusao: dataConclusao || null
    };

    setSubmitting(true);

    try {
      await createMatricula(payload);

      const novoCurso = cursos.find(c => c.id === parseInt(cursoSelecionado));

      if (novoCurso) {
        setCursosMatriculados([
          ...cursosMatriculados,
          {
            id: novoCurso.id,
            nome: novoCurso.nome,
            dataConclusao: dataConclusao || null
          }
        ]);
      }

      setCursoSelecionado("");
      setDataConclusao("");
      toast.success("Aluno matriculado com sucesso!");
    } catch (error) {
      console.error("Erro ao matricular:", error);
      toast.error("Erro ao matricular aluno. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !isCreateMode) {
    return <p className="text-gray-medium">Carregando cursos...</p>;
  }

  const todosCursos = isCreateMode
    ? cursosPendentes
    : cursosMatriculados;

  return (
    <>
      <h2 className="text-black font-medium text-[22px] py-4">Cursos</h2>

      {todosCursos.length > 0 && (
        <div className="flex flex-col gap-4 w-full mb-[26px]">
          {todosCursos.map((curso, index) => (
            <div key={curso.id || index} className="flex items-center gap-4">
              <div className="flex-1 md:flex-3 relative">
                <select
                  disabled
                  className="text-gray-medium w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%239CA3AF'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.25rem 1.25rem'
                  }}
                >
                  <option>{curso.nome}</option>
                </select>
              </div>
              <div className="flex-1 relative">
                <input
                  type="date"
                  defaultValue={curso.dataConclusao || ""}
                  disabled
                  className="text-gray-medium w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input"
                />
              </div>
              <div className="flex items-center justify-center" style={{ width: "30px", height: "30px" }}>
                <img className="w-6 h-6" src={check} alt="Check" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 w-full">
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
          className="ml-2 flex items-center justify-center cursor-pointer mt-7"
          style={{ height: "30px", width: "30px" }}
        >
          <LiaPlusCircleSolid className="w-full h-full" />
        </button>
      </div>
    </>
  );
};
