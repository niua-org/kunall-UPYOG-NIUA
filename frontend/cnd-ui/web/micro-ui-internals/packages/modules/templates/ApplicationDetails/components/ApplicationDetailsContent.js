import {
  BreakLine,
  Card,
  CardSectionHeader,
  CardSubHeader,
  CheckPoint,
  ConnectingCheckPoints,
  Loader,
  Row,
  StatusTable,
  LinkButton,
  PDFSvg
} from "@nudmcdgnpm/digit-ui-react-components";
// import { values } from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// import ArrearSummary from "../../../common/src/payments/citizen/bills/routes/bill-details/arrear-summary"

function ApplicationDetailsContent({
  applicationDetails,
  workflowDetails,
  isDataLoading,
  applicationData,
  // businessService,
  timelineStatusPrefix,
  // id,
  showTimeLine = true,
  statusAttribute = "status",
  // paymentsList,
  oldValue,
  // isInfoLabel = false
}) {
  const { t } = useTranslation();

  const ownersSequences = applicationDetails?.applicationData?.owners
  console.log("ownersSequences:- ", ownersSequences)

  function OpenImage(imageSource, index, thumbnailsToShow) {
    window.open(thumbnailsToShow?.fullImage?.[0], "_blank");
  }

  const [fetchBillData, updatefetchBillData] = useState({});

  const setBillData = async (tenantId, propertyIds, updatefetchBillData, updateCanFetchBillData) => {
    // const assessmentData = await Digit.PTService.assessmentSearch({ tenantId, filters: { propertyIds } });
    let billData = {};
    // if (assessmentData?.Assessments?.length > 0) {
    //   billData = await Digit.PaymentService.fetchBill(tenantId, {
    //     businessService: "PT",
    //     consumerCode: propertyIds,
    //   });
    // }
    updatefetchBillData(billData);
    updateCanFetchBillData({
      loading: false,
      loaded: true,
      canLoad: true,
    });
  };
  const [billData, updateCanFetchBillData] = useState({
    loading: false,
    loaded: false,
    canLoad: false,
  });

  if (applicationData?.status == "ACTIVE" && !billData.loading && !billData.loaded && !billData.canLoad) {
    updateCanFetchBillData({
      loading: false,
      loaded: false,
      canLoad: true,
    });
  }
  if (billData?.canLoad && !billData.loading && !billData.loaded) {
    updateCanFetchBillData({
      loading: true,
      loaded: false,
      canLoad: true,
    });
    setBillData(applicationData?.tenantId || tenantId, applicationData?.propertyId, updatefetchBillData, updateCanFetchBillData);
  }
  const convertEpochToDateDMY = (dateEpoch) => {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  };
  const getTimelineCaptions = (checkpoint, index = 0, timeline) => {
    if (checkpoint.state === "OPEN" || (checkpoint.status === "INITIATED" /*&& !window.location.href.includes("/obps/")*/)) {
      const caption = {
        date: convertEpochToDateDMY(applicationData?.auditDetails?.createdTime),
        source: applicationData?.channel || "",
      };
      return <TLCaption data={caption} />;
    } 
    // else if (window.location.href.includes("/obps/") || window.location.href.includes("/noc/") || window.location.href.includes("/ws/")) {
    //   const privacy = {
    //     uuid: checkpoint?.assignes?.[0]?.uuid,
    //     fieldName: "mobileNumber",
    //     model: "User",
    //     showValue: false,
    //     loadData: {
    //       serviceName: "/egov-workflow-v2/egov-wf/process/_search",
    //       requestBody: {},
    //       requestParam: { tenantId: applicationDetails?.tenantId, businessIds: applicationDetails?.applicationNo, history: true },
    //       jsonPath: "ProcessInstances[0].assignes[0].mobileNumber",
    //       isArray: false,
    //       d: (res) => {
    //         let resultstring = "";
    //         resultstring = `+91 ${_.get(res, `ProcessInstances[${index}].assignes[0].mobileNumber`)}`;
    //         return resultstring;
    //       }
    //     },
    //   };
    //   const previousCheckpoint = timeline[index - 1];
    //   const caption = {
    //     date: checkpoint?.auditDetails?.lastModified,
    //     name: checkpoint?.assignes?.[0]?.name,
    //     mobileNumber: applicationData?.processInstance?.assignes?.[0]?.uuid === checkpoint?.assignes?.[0]?.uuid && applicationData?.processInstance?.assignes?.[0]?.mobileNumber
    //       ? applicationData?.processInstance?.assignes?.[0]?.mobileNumber
    //       : checkpoint?.assignes?.[0]?.mobileNumber,
    //     comment: t(checkpoint?.comment),
    //     wfComment: previousCheckpoint ? previousCheckpoint.wfComment : [],
    //     thumbnailsToShow: checkpoint?.thumbnailsToShow,
    //   };


    //   return <TLCaption data={caption} OpenImage={OpenImage} privacy={privacy} />;
    // } 
    else {

      const caption = {
        date: convertEpochToDateDMY(applicationData?.auditDetails?.lastModifiedTime),
        name: checkpoint?.assignes?.[0]?.name,
        wfComment: checkpoint?.wfComment,
        mobileNumber: checkpoint?.assignes?.[0]?.mobileNumber,
        thumbnailsToShow: checkpoint?.thumbnailsToShow
      };

      return <TLCaption data={caption} OpenImage={OpenImage} />;
    }
  };

  const getTranslatedValues = (dataValue, isNotTranslated) => {
    if (dataValue) {
      return !isNotTranslated ? t(dataValue) : dataValue;
    } else {
      return t("NA");
    }
  };

  const checkLocation =
    window.location.href.includes("employee/tl") || window.location.href.includes("employee/obps") || window.location.href.includes("employee/noc");
  const isNocLocation = window.location.href.includes("employee/noc");
  const isBPALocation = window.location.href.includes("employee/obps");
  const isWS = window.location.href.includes("employee/ws");

  // const getRowStyles = () => {
  //   if (window.location.href.includes("employee/obps") || window.location.href.includes("employee/noc")) {
  //     return { justifyContent: "space-between", fontSize: "16px", lineHeight: "19px", color: "#0B0C0C" };
  //   } else if (checkLocation) {
  //     return { justifyContent: "space-between", fontSize: "16px", lineHeight: "19px", color: "#0B0C0C" };
  //   } else {
  //     return {};
  //   }
  // };

  // const getTableStyles = () => {
  //   if (window.location.href.includes("employee/obps") || window.location.href.includes("employee/noc")) {
  //     return { position: "relative", marginTop: "19px" };
  //   } else if (checkLocation) {
  //     return { position: "relative", marginTop: "19px" };
  //   } else {
  //     return {};
  //   }
  // };

  const getMainDivStyles = () => {
    // if (
    //   window.location.href.includes("employee/obps") ||
    //   window.location.href.includes("employee/noc") ||
    //   window.location.href.includes("employee/ws")
    // ) {
    //   return { lineHeight: "19px", maxWidth: "950px", minWidth: "280px" };
    // } else if is below
     if (checkLocation) {
      return { lineHeight: "19px", maxWidth: "600px", minWidth: "280px" };
    } else {
      return {};
    }
  };

  const getTextValue = (value) => {
    if (value?.skip) return value.value;
    else if (value?.isUnit) return value?.value ? `${getTranslatedValues(value?.value, value?.isNotTranslated)} ${t(value?.isUnit)}` : t("N/A");
    else return value?.value ? getTranslatedValues(value?.value, value?.isNotTranslated) : t("N/A");
  };

  // const getClickInfoDetails = () => {
  //   if (window.location.href.includes("disconnection") || window.location.href.includes("application")) {
  //     return "WS_DISCONNECTION_CLICK_ON_INFO_LABEL"
  //   } else {
  //     return "WS_CLICK_ON_INFO_LABEL"
  //   }
  // }

  const [showAllTimeline, setShowAllTimeline] = useState(false);
  // const getClickInfoDetails1 = () => {
  //   if (window.location.href.includes("disconnection") || window.location.href.includes("application")) {
  //     return "WS_DISCONNECTION_CLICK_ON_INFO1_LABEL"
  //   } else {
  //     return ""
  //   }
  // }
  const toggleTimeline = () => {
    setShowAllTimeline((prev) => !prev);
  }
// this is file open service
  const openFilePDF = (fileId) => {
    Digit.UploadServices.Filefetch([fileId], Digit.ULBService.getStateId()).then((res) => {
      console.log('Response of file:', res);
  
      // Extract the concatenated URL string
      const concatenatedUrls = res?.data?.fileStoreIds?.[0]?.url;
  
      if (concatenatedUrls) {
        // Split the string by commas to get individual URLs
        const urlArray = concatenatedUrls.split(',');
  
        // Pick the first URL (or any other logic to decide which URL to open)
        const fileUrl = urlArray[0];
  
        if (fileUrl) {
          window.open(fileUrl, '_blank'); // Open the file in a new tab
        } else {
          console.error('No valid URL found to open!');
        }
      } else {
        console.error('URL is missing in the response!');
      }
    }).catch((error) => {
      console.error('Error fetching file:', error);
    });
  };
  
  // console.log("applicationDetails?.applicationDetails",applicationDetails?.applicationDetails)
  return (
    <Card style={{ position: "relative" }} className={"employeeCard-override"}>
      {/* For UM-4418 changes */}
      {/* {isInfoLabel ? <InfoDetails t={t} userType={false} infoBannerLabel={"CS_FILE_APPLICATION_INFO_LABEL"} infoClickLable={"WS_CLICK_ON_LABEL"} infoClickInfoLabel={getClickInfoDetails()} infoClickInfoLabel1={getClickInfoDetails1()} /> : null} */}

      {applicationDetails?.applicationDetails?.map((detail, index) => (
        <React.Fragment key={index}>
          <div style={getMainDivStyles()}>
            {index === 0 && !detail.asSectionHeader ? (
              <CardSubHeader style={{ marginBottom: "16px", fontSize: "24px" }}>{t(detail.title)}</CardSubHeader>
            ) : (
              <React.Fragment>
                <CardSectionHeader
                  style={
                    index == 0 && checkLocation
                      ? { marginBottom: "16px", fontSize: "24px" }
                      : { marginBottom: "16px", marginTop: "32px", fontSize: "24px" }
                  }
                >
                  {/*{isNocLocation ? `${t(detail.title)}` :*/ t(detail.title)}
                  {detail?.Component ? <detail.Component /> : null}
                </CardSectionHeader>
              </React.Fragment>
            )}
            {/* TODO, Later will move to classes */}
            {/* Here Render the table for adjustment amount details detail.isTable is true for that table*/}

            {detail?.isTable && (
              <table style={{ tableLayout: "fixed", width: "100%", borderCollapse: "collapse" }}>
                <tr style={{ textAlign: "left" }}>
                  {detail?.headers.map((header) => (
                    <th style={{ padding: "10px", paddingLeft: "0px" }}>{t(header)}</th>
                  ))}
                </tr>

                {detail?.tableRows.map((row, index) => {
                  // if (index === detail?.tableRows.length - 1) {
                  //   return <>
                  //     <hr style={{ width: "1200px", marginTop: "15px" }} className="underline" />
                  //     <tr>
                  //       {row.map(element => <td style={{ textAlign: "left" }}>{t(element)}</td>)}
                  //     </tr>
                  //   </>
                  // }
                  return <tr>
                  {console.log('Testing row:- ', row)}
                  {row.map((element, idx) => (
                    Array.isArray(element) && element.length > 1 && detail.isMaintenance === true? (
                      <td style={{ paddingTop: "20px", textAlign: "left" }} key={idx}>
                      <div style={{ display: "flex", flexWrap: "nowrap", gap: "5px" }}>
                        {element.map((file, fileIndex) => (
                          <a
                            key={fileIndex} // Ensure each <a> tag has a unique key
                            onClick={() => openFilePDF(file.fileStoreId)}
                            rel="noopener noreferrer"
                            style={{ marginRight: "5px", display: "inline-block", cursor: "pointer"  }}
                          >
                            <PDFSvg style={{ width: "35px", height: "35px" }}/>
                          </a>
                        ))}
                      </div>
                    </td>
                    
                    ) : (
                      <td key={idx} style={{ paddingTop: "20px", textAlign: "left" }}>
                        {t(element)}
                      </td>
                    )
                  ))}
                </tr>
                })}
              </table>
            )}

<StatusTable style={getTableStyles()}>
              {detail?.title &&
                // !detail?.title.includes("NOC") &&
                detail?.values?.map((value, index) => {
                  if (value.map === true && value.value !== "N/A") {
                    return <Row labelStyle={{ wordBreak: "break-all" }} textStyle={{ wordBreak: "break-all" }} key={t(value.title)} label={t(value.title)} text={<img src={t(value.value)} alt="" privacy={value?.privacy} />} />;
                  }
                  if (value?.isLink == true) {
                    return (
                      <Row
                        key={t(value.title)}
                        label={
                          // window.location.href.includes("tl") || window.location.href.includes("ws") ? (
                          //   <div style={{ width: "200%" }}>
                          //     <Link to={value?.to}>
                          //       <span className="link" style={{ color: "#a82227" }}>
                          //         {t(value?.title)}
                          //       </span>
                          //     </Link>
                          //   </div>
                          // ) : isNocLocation || isBPALocation ? (
                          //   `${t(value.title)}`
                          // ) : (
                            t(value.title)
                          // )
                        }
                        text={
                          <div>
                            <Link to={value?.to}>
                              <span className="link" style={{ color: "#a82227" }}>
                                {value?.value}
                              </span>
                            </Link>
                          </div>
                        }
                        last={index === detail?.values?.length - 1}
                        caption={value.caption}
                        className="border-none"
                        // rowContainerStyle={getRowStyles()}
                        labelStyle={{ wordBreak: "break-all" }}
                        textStyle={{ wordBreak: "break-all" }}
                      />
                    );
                  }
                  return (
                    <div>
                      {/* {window.location.href.includes("modify") ? (
                        <Row
                          className="border-none"
                          key={`${value.title}`}
                          label={`${t(`${value.title}`)}`}
                          privacy={value?.privacy}
                          text={value?.oldValue ? value?.oldValue : value?.value ? value?.value : ""}
                          labelStyle={{ wordBreak: "break-all" }}
                          textStyle={{ wordBreak: "break-all" }}
                        />) :  */}
                        {(<Row
                          key={t(value.title)}
                          label={t(value.title)}
                          text={getTextValue(value)}
                          last={index === detail?.values?.length - 1}
                          caption={value.caption}
                          className="border-none"
                          /* privacy object set to the Row Component */
                          privacy={value?.privacy}
                          // TODO, Later will move to classes
                          // rowContainerStyle={getRowStyles()}
                          // labelStyle={{wordBreak: "break-all"}}
                          // textStyle={{wordBreak: "break-all"}}
                          labelStyle={{
                            wordBreak: "break-all",
                            fontWeight: value.isBold ? 'bold' : 'normal',
                            fontStyle: value.isBold ? 'italic' : 'normal'
                          }}
                          textStyle={{
                            wordBreak: "break-all",
                            fontWeight: value.isBold ? 'bold' : 'normal',
                            fontStyle: value.isBold ? 'italic' : 'normal'
                          }}
                        />
                      )}
                      {/* {value.title === "PT_TOTAL_DUES" ? <ArrearSummary bill={fetchBillData.Bill?.[0]} /> : ""} */}
                    </div>
                  )
                })}
            </StatusTable>
          </div>
          {detail?.belowComponent && <detail.belowComponent />}
          {/* {detail?.additionalDetails?.inspectionReport && (
            <ScruntinyDetails scrutinyDetails={detail?.additionalDetails} paymentsList={paymentsList} />
          )}
          {applicationDetails?.applicationData?.additionalDetails?.fieldinspection_pending?.length > 0 && detail?.additionalDetails?.fiReport && (
            <InspectionReport fiReport={applicationDetails?.applicationData?.additionalDetails?.fieldinspection_pending} />
          )} */}
          {/* {detail?.additionalDetails?.FIdocuments && detail?.additionalDetails?.values?.map((doc,index) => (
            <div key={index}>
            {doc.isNotDuplicate && <div> 
             <StatusTable>
             <Row label={t(doc?.documentType)}></Row>
             <OBPSDocument value={detail?.additionalDetails?.values} Code={doc?.documentType} index={index}/> 
             <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
             </StatusTable>
             </div>}
             </div>
          )) } */}
          {/* {detail?.additionalDetails?.floors && <PropertyFloors floors={detail?.additionalDetails?.floors} />}
          {detail?.additionalDetails?.owners && <PropertyOwners owners={detail?.additionalDetails?.owners} />}
          {detail?.additionalDetails?.units && <TLTradeUnits units={detail?.additionalDetails?.units} />}
          {detail?.additionalDetails?.accessories && <TLTradeAccessories units={detail?.additionalDetails?.accessories} />} */}
          {/* {detail?.additionalDetails?.permissions && workflowDetails?.data?.nextActions?.length > 0 && (
            <PermissionCheck applicationData={applicationDetails?.applicationData} t={t} permissions={detail?.additionalDetails?.permissions} />
          )} */}
          {/* {detail?.additionalDetails?.obpsDocuments && (
            <BPADocuments
              t={t}
              applicationData={applicationDetails?.applicationData}
              docs={detail.additionalDetails.obpsDocuments}
              bpaActionsDetails={workflowDetails}
            />
          )}
          {detail?.additionalDetails?.noc && (
            <NOCDocuments
              t={t}
              isNoc={true}
              NOCdata={detail.values}
              applicationData={applicationDetails?.applicationData}
              docs={detail.additionalDetails.noc}
              noc={detail.additionalDetails?.data}
              bpaActionsDetails={workflowDetails}
            />
          )}
          {detail?.additionalDetails?.scruntinyDetails && <ScruntinyDetails scrutinyDetails={detail?.additionalDetails} />}
          {detail?.additionalDetails?.buildingExtractionDetails && <ScruntinyDetails scrutinyDetails={detail?.additionalDetails} />}
          {detail?.additionalDetails?.subOccupancyTableDetails && (
            <SubOccupancyTable edcrDetails={detail?.additionalDetails} applicationData={applicationDetails?.applicationData} />
          )} */}
          {/* {detail?.additionalDetails?.documentsWithUrl && <DocumentsPreview documents={detail?.additionalDetails?.documentsWithUrl} />} */}
          {/* {detail?.additionalDetails?.documents && <PropertyDocuments documents={detail?.additionalDetails?.documents} />}
          {detail?.additionalDetails?.taxHeadEstimatesCalculation && (
            <PropertyEstimates taxHeadEstimatesCalculation={detail?.additionalDetails?.taxHeadEstimatesCalculation} />
          )}
          {detail?.isWaterConnectionDetails && <WSAdditonalDetails wsAdditionalDetails={detail} oldValue={oldValue} />} */}
          {/* {detail?.isLabelShow ? <WSInfoLabel t={t} /> : null} */}
          {detail?.additionalDetails?.redirectUrl && (
            <div style={{ fontSize: "16px", lineHeight: "24px", fontWeight: "400", padding: "10px 0px" }}>
              <Link to={detail?.additionalDetails?.redirectUrl?.url}>
                <span className="link" style={{ color: "#a82227" }}>
                  {detail?.additionalDetails?.redirectUrl?.title}
                </span>
              </Link>
            </div>
          )}
          {/* {detail?.additionalDetails?.estimationDetails && <WSFeeEstimation wsAdditionalDetails={detail} workflowDetails={workflowDetails} />} */}
          {/* {detail?.additionalDetails?.estimationDetails && <ViewBreakup wsAdditionalDetails={detail} workflowDetails={workflowDetails} />} */}

        </React.Fragment>
      ))}
      {showTimeLine && workflowDetails?.data?.timeline?.length > 0 && (
        <React.Fragment>
          <BreakLine />
          {(workflowDetails?.isLoading || isDataLoading) && <Loader />}
          {!workflowDetails?.isLoading && !isDataLoading && (
            <Fragment>
              <div id="timeline">
                <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>
                  {t("ES_APPLICATION_DETAILS_APPLICATION_TIMELINE")}
                </CardSectionHeader>
                {workflowDetails?.data?.timeline && workflowDetails?.data?.timeline?.length === 1 ? (
                  <CheckPoint
                    isCompleted={true}
                    label={t(`${timelineStatusPrefix}${workflowDetails?.data?.timeline[0]?.state}`)}
                    customChild={getTimelineCaptions(workflowDetails?.data?.timeline[0], workflowDetails?.data?.timeline)}
                  />
                ) : (
                  <ConnectingCheckPoints>
                    {workflowDetails?.data?.timeline &&
                      workflowDetails?.data?.timeline.slice(0, showAllTimeline ? workflowDetails?.data.timeline.length : 2).map((checkpoint, index, arr) => {
                        let timelineStatusPostfix = "";
                        // if (window.location.href.includes("/obps/")) {
                        //   if (workflowDetails?.data?.timeline[index - 1]?.state?.includes("BACK_FROM") || workflowDetails?.data?.timeline[index - 1]?.state?.includes("SEND_TO_CITIZEN"))
                        //     timelineStatusPostfix = `_NOT_DONE`
                        //   else if (checkpoint?.performedAction === "SEND_TO_ARCHITECT")
                        //     timelineStatusPostfix = `_BY_ARCHITECT_DONE`
                        //   else
                        //     timelineStatusPostfix = index == 0 ? "" : `_DONE`;
                        // }

                        return (
                          <React.Fragment key={index}>
                            <CheckPoint
                              keyValue={index}
                              isCompleted={index === 0}
                              info={checkpoint.comment}
                              label={t(
                                `${timelineStatusPrefix}${/*checkpoint?.performedAction === "REOPEN" ? checkpoint?.performedAction : */ checkpoint?.[statusAttribute]
                                }${timelineStatusPostfix}`
                              )}
                              customChild={getTimelineCaptions(checkpoint, index, workflowDetails?.data?.timeline)}
                            />
                          </React.Fragment>
                        );
                      })}
                  </ConnectingCheckPoints>
                )}
                {workflowDetails?.data?.timeline?.length > 2 && (
                  <LinkButton label={showAllTimeline ? t("COLLAPSE") : t("VIEW_TIMELINE")} onClick={toggleTimeline}>
                  </LinkButton>
                )}
              </div>
            </Fragment>
          )}
        </React.Fragment>
      )}
    </Card>
  );
}

export default ApplicationDetailsContent;
