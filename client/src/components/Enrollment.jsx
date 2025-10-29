import { LiaPlusCircleSolid } from "react-icons/lia"

/**
 * Componente para gerenciar a seleção e adição de cursos em um formulário de aluno (gerencia matrículas).
 * 
 * Este componente exibe um dropdown para selecionar cursos disponíveis (excluindo os já selecionados),
 * um campo de data de conclusão e um botão para adicionar o curso selecionado ao aluno.
 */

export const Enrollment = ({
  courses = [],
  allCourses = [],
  setSelectedCourse,
  setCompletionDate,
  submitting,
  selectedCourse,
  completionDate,
  handleAddCourse
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4 w-full px-2">
      <div className="flex-1 md:flex-3">
        <label className="text-sm font-medium text-neutral-black" htmlFor="course">
          Curso
        </label>
        <select
          id="course"
          name="course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="text-gray-medium w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input mt-2"
          disabled={submitting}
        >
          <option value="">Selecione uma opção</option>
          {(courses || [])
            .filter(c => !(allCourses || []).some(cm => cm.id === c.id))
            .map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))
          }
        </select>
      </div>

      <div className="flex items-end gap-6 sm:gap-4 flex-1">
        <div className="flex-1">
          <label className="text-sm font-medium text-neutral-black" htmlFor="completionDate">
            Data de Conclusão
          </label>
          <input
            type="date"
            id="completionDate"
            name="completionDate"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            className="text-gray-medium w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input mt-2"
            disabled={submitting}
          />
        </div>

        <button
          type="button"
          onClick={handleAddCourse}
          disabled={submitting}
          className="flex items-center justify-center cursor-pointer disabled:opacity-50"
          style={{ height: "30px", width: "30px" }}
        >
          <LiaPlusCircleSolid className="w-full h-full -mt-5" />
        </button>
      </div>
    </div>
  );
}
