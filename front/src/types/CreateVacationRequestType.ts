export interface VacationRequestBody {
  dataSolicitacao: string;
  dataInicio: string;
  dataTermino: string;
  mensagemColaborador: string;
  mensagemGestor: string;
  statusSolicitacao: "Em Aberto" | "Finalizada" | "Negada" | "Em Férias";
  colaborador: string;
}
