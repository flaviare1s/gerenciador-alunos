import { LiaPlusCircleSolid } from "react-icons/lia";

export const AlunoCursosList = ({ cursos, register, errors }) => {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex-1 md:flex-3">
        <label className="text-sm font-medium text-neutral-black" htmlFor="curso">
          Curso
        </label>
        <select
          id="curso"
          name="curso"
          className="text-gray-medium w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input mt-2"
          {...register("curso")}
        >
          <option value="">Selecione uma opção</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.id}>
              {curso.nome}
            </option>
          ))}
        </select>
        {errors?.curso && <small className="text-primary">{errors.curso.message}</small>}
      </div>
      <div className="flex-1">
        <label className="text-sm font-medium text-neutral-black" htmlFor="dataConclusao">
          Data de Conclusão
        </label>
        <input
          type="date"
          id="dataConclusao"
          name="dataConclusao"
          {...register("dataConclusao")}
          className="text-gray-medium w-full px-5 h-[50px] font-medium font-sm rounded-md border border-border-input mt-2"
        />
        {errors?.dataConclusao && (
          <small className="text-xs text-primary">{errors.dataConclusao.message}</small>
        )}
      </div>
      <button
        type="button"
        className="ml-2 flex items-center justify-center cursor-pointer mt-7"
        style={{ height: "30px", width: "30px" }}
      >
        <LiaPlusCircleSolid className="w-full h-full" />
      </button>
    </div>
  );
};
