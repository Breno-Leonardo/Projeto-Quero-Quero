import { Container } from "../../components/Container";
import styles from "./css/ResponsePageManager.module.css";
import { EmployeeLine } from "../../components/EmployeeLine";
import { Button } from "../../components/Button";
import { TextArea } from "../../components/TextArea";
import { formatDate, formatNameForMobile } from "../../functions/auxFunctions";
import { Topics } from "../../components/Topics";
import { useGlobalContext } from "../../hooks/useGlobalContext";
import { useEffect, useState } from "react";
import { getCurrentVacationRequestID } from "../../functions/connections/auth";
import {
  URL_ACCEPT_VACATION_REQUEST,
  URL_GET_ALL_VACATION_REQUEST,
  URL_UPDATE_VACATION_REQUEST,
} from "../../constants/constants";
import { useRequests } from "../../hooks/useRequests";
import { VacationRequestReturn } from "../../types/ReturnVacationRequestType";

export function ResponsePageManager() {
  const [managerMessage, setManagerMessage] = useState("");
  const { currentVacationRequest, setCurrentVacationRequestStorageContext } =
    useGlobalContext();
  const [loadingIntersection, setLoadingIntersection] = useState(true);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const { getRequest, putRequest } = useRequests();
  const [intersectionRequests, setIntersectionRequests] =
    useState<VacationRequestReturn[]>();
  const [contentIntersectionRequest, setContentIntersectionRequest] =
    useState<any>();
  useEffect(() => {
    if (currentVacationRequest != undefined) {
      setLoadingRequest(false);
      const getIntersectionVacationRequest = async () =>
        await getRequest(
          URL_GET_ALL_VACATION_REQUEST +
            "/time/" +
            currentVacationRequest.colaborador.time.id
        )
          .then((result: VacationRequestReturn[]) => {
            const startCurrent = new Date(currentVacationRequest.dataInicio);
            const endCurrent = new Date(currentVacationRequest.dataTermino);
            result = result.filter((request) => {
              if (request.id != currentVacationRequest.id) {
                const startReq = new Date(request.dataInicio);
                const endReq = new Date(request.dataTermino);
                if (
                  (startReq >= startCurrent && startReq <= endCurrent) ||
                  (startReq <= startCurrent && endReq >= startCurrent)
                ) {
                  return request;
                }
              }
            });
            setIntersectionRequests(result);
          })
          .catch((err) => {});
      getIntersectionVacationRequest();
    } else {
      const idRequest = getCurrentVacationRequestID();
      const getVacationRequest = async () =>
        await getRequest(URL_GET_ALL_VACATION_REQUEST + "/id/" + idRequest)
          .then((result) => {
            setCurrentVacationRequestStorageContext(result[0]);
          })
          .catch((err) => {});
      getVacationRequest();
    }
  }, [currentVacationRequest]);

  //set content requests
  useEffect(() => {
    if (intersectionRequests != undefined) {
      setContentIntersectionRequest(
        intersectionRequests.map((soli: VacationRequestReturn) => {
          return (
            <EmployeeLine
              fields={[
                formatNameForMobile(soli.colaborador.nome),
                formatDate(soli.dataInicio),
                formatDate(soli.dataTermino),
              ]}
              colorsFields={["black", "green", "red"]}
              position="center"
              key={soli.id + Math.floor(Math.random() * 101).toString()}
            ></EmployeeLine>
          );
        })
      );
      setLoadingIntersection(false);
    }
  }, [intersectionRequests]);

  //
  const handleManagerMessage = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setManagerMessage(event.target.value);
  };

  // days for minus
  let diffInDays = 0;
  if (currentVacationRequest != undefined) {
    const diffInMs =
      new Date(currentVacationRequest.dataTermino).getTime() -
      new Date(currentVacationRequest.dataInicio).getTime();
    diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  }

  //handle update

  const rejectRequest = async () => {
    const request = await putRequest(
      URL_UPDATE_VACATION_REQUEST + "/" + currentVacationRequest?.id,
      {
        mensagemGestor: managerMessage,
        statusSolicitacao: "Recusada",
      }
    ).then((response) => {
      window.location.href = window.location.href.replace("resposta", "");
    });
    request;
  };
  const acceptRequest = async () => {
    const request = await putRequest(
      URL_ACCEPT_VACATION_REQUEST +
        "/" +
        currentVacationRequest?.id +
        "/" +
        diffInDays,
      {
        mensagemGestor: managerMessage,
        statusSolicitacao: "Agendada",
      }
    ).then((response) => {
      window.location.href = window.location.href.replace("resposta", "");
    });
    request;
  };
  let limitCurrentCocessive;
  if (currentVacationRequest != undefined) {
    limitCurrentCocessive = new Date(
      currentVacationRequest.colaborador.fimAquisitivo
    );

    limitCurrentCocessive.setUTCDate(limitCurrentCocessive.getUTCDate() - 1);
  }

  return (
    <>
      <Container loading={loadingIntersection} title="Interseções de Férias">
        <Topics fields={["Nome", "Início", "Fim"]} position="center"></Topics>
        {contentIntersectionRequest}
      </Container>

      <Container loading={loadingRequest} title="Solicitação">
        <></>
        {currentVacationRequest != undefined &&
        limitCurrentCocessive != undefined ? (
          <>
            <div className={styles.infos}>
              <div className={styles.infoPrimary}>
                Nome:{" "}
                {formatNameForMobile(currentVacationRequest?.colaborador.nome)}
              </div>
              <div className={styles.infoSecondary}>
                Cargo: {currentVacationRequest?.colaborador.cargo}
              </div>
            </div>
            <div className={styles.infos}>
              <span className={styles.infoPrimary}>
                Data Início: {formatDate(currentVacationRequest?.dataInicio)}
              </span>
              <span className={styles.infoSecondary}>
                Data Término: {formatDate(currentVacationRequest?.dataTermino)}
              </span>
            </div>
            <div className={styles.infos}>
              <span className={styles.infoPrimary}>
                Saldo Restante De Dias:{" "}
                {currentVacationRequest?.colaborador.saldoDiasFerias -
                  diffInDays}
              </span>
              <span className={styles.infoSecondary}>
                Data Limite Concessiva:{" "}
                {formatDate(limitCurrentCocessive.toUTCString())}
              </span>
            </div>
            {currentVacationRequest.mensagemColaborador != "" ? (
              <TextArea
                value={currentVacationRequest?.mensagemColaborador}
                title="Mensagem Do Colaborador"
                placeholder=""
                disabled={true}
              ></TextArea>
            ) : (
              <></>
            )}

            <TextArea
              onChange={handleManagerMessage}
              placeholder="Digite uma mensagem para o fucionário, caso necessário"
            ></TextArea>
            <div className={styles.divForButton}>
              <Button
                onClick={() => acceptRequest()}
                content="Aprovar"
                size="Big"
              ></Button>
              <Button
                onClick={() => rejectRequest()}
                content="Reprovar"
                size="Big"
                color="Red"
              ></Button>
            </div>
          </>
        ) : (
          <></>
        )}
      </Container>
    </>
  );
}
