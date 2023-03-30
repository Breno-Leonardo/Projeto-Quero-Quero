import { Container } from "../../components/Container";
import styles from "./css/RequestsPageCollaborator.module.css";
import { EmployeeLine } from "../../components/EmployeeLine";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Link } from "react-router-dom";
import { Topics } from "../../components/Topics";
import {
  formatDate,
  formatDateRequestTopic,
  
} from "../../functions/auxFunctions";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { useRequests } from "../../hooks/useRequests";
import { useEffect, useState } from "react";
import { URL_GET_ALL_VACATION_REQUEST } from "../../constants/constants";
import { VacationRequestBody } from "../../types/VacationRequestType";


export function RequestsPageCollaborator() {
  const { collaborator } = useGlobalContext();
  const { getRequest } = useRequests();
  const [requests, setRequests] = useState<VacationRequestBody[]>();
  const [loading, setLoading] = useState(true);
  let aquisitiveEnd = "";
  let aquisitiveStart = "";
  let concessiveEnd = "";
  let concessiveStart = "";
  useEffect(() => {
    const getRequests = async () =>
      await getRequest(
        URL_GET_ALL_VACATION_REQUEST + "/" + collaborator?.matricula
      )
        .then((result: VacationRequestBody[]) => {
          //filtering for requests of the year
          result = result.filter(
            (request) => request.dataSolicitacao.indexOf("2023-") > -1
          );
          setLoading(false);
          setRequests(result);
        })
        .catch(() => {});
    if (collaborator != undefined) {
      getRequests();
    }
  }, [collaborator]);
  //dates cards
  if (collaborator != undefined) {
    //aquisitive
    aquisitiveEnd = new Date(collaborator?.fimAquisitivo).toUTCString();
    let aux = new Date(collaborator?.fimAquisitivo);
    aux.setUTCFullYear(aux.getUTCFullYear()-1);
    aux.setUTCDate(aux.getUTCDate() +1)
    aquisitiveStart = aux.toUTCString();
    //concessive
    aux = new Date(collaborator?.fimAquisitivo);
    aux.setUTCFullYear(aux.getUTCFullYear()+1);
    aux.setUTCDate(aux.getUTCDate() -collaborator.saldoDiasFerias)
    concessiveEnd=aux.toUTCString()
    aux = new Date(collaborator?.fimAquisitivo);
    aux.setUTCDate(aux.getUTCDate() +1)
    concessiveStart=aux.toUTCString();

  }
  return (
    <>
      {collaborator != undefined ? (
        <div className={styles.divCards}>
          <Card
            content={collaborator?.saldoDiasFerias.toString()}
            size="Medium"
            title="Saldo De Dias"
          ></Card>
          <Card
            content=""
            initialDateContent={formatDate(aquisitiveStart)}
            finalDateContent={formatDate(aquisitiveEnd)}
            size="Medium"
            title="Período Aquisitivo"
          ></Card>
          <Card
            content=""
            initialDateContent={formatDate(concessiveStart)}
            finalDateContent={formatDate(concessiveEnd)}
            size="Medium"
            title="Período Concessivo"
          ></Card>
        </div>
      ) : (
        <></>
      )}

      <Container loading={loading} title="Solicitações">
        <Topics
          fields={[formatDateRequestTopic(), "Início", "Fim", "Status"]}
          position="center"
        ></Topics>

        {requests != undefined ? (
          requests.map((soli: any) => {
            return (
              <EmployeeLine
                fields={[
                  formatDate(soli.dataSolicitacao),
                  formatDate(soli.dataInicio),
                  formatDate(soli.dataTermino),
                  soli.statusSolicitacao,
                ]}
                colorsFields={["black", "green", "red", "black"]}
                position="center"
                hasIcon={false}
                key={soli.id+Math.floor(Math.random() * 101).toString()}
              ></EmployeeLine>
            );
          })
        ) : (
          <></>
        )}

        <Link to="/colaborador/nova-solicitacao">
          <Button content="Nova Solicitação" size="ExtraBig"></Button>
        </Link>
      </Container>
    </>
  );
}
