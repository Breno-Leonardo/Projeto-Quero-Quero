import { CollaboratorType } from "./CollaboratoType";

export interface VacationRequestReturn {
  id:number
  dataSolicitacao: string;
  dataInicio: string;
  dataTermino: string;
  mensagemColaborador: string;
  mensagemGestor: string;
  statusSolicitacao: "Em Aberto" | "Finalizada" | "Negada" | "Em Férias"| "Agendada";
  colaborador: CollaboratorType;
}
