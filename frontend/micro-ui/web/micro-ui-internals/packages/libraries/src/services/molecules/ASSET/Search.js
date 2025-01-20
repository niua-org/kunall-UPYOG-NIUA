
import { ASSETService } from "../../elements/ASSET";

const convertTimestampToDate = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const getData = (res, combinedData) => {

  let formJson = combinedData
    .filter((category) => {
      const isMatch = category.assetParentCategory === res?.assetParentCategory || category.assetParentCategory === "COMMON";
      return isMatch;
    })
    .map((category) => category.fields) // Extract the fields array
    .flat() // Flatten the fields array
    .filter((field) => field.active === true);


  let rows = []
  formJson.map((row, index) => (
    // rows.push({ title: row.code, value: res?.additionalDetails[row.name]) })
    rows.push({ title: row.code, value: extractValue(res?.additionalDetails[row.name]) })
  ));

  // Add more rows to the rows array for Static 
  rows.push({ title: "AST_MODE_OF_POSSESSION_OR_ACQUISITION", value: res?.modeOfPossessionOrAcquisition });
  rows.push({ title: "AST_INVOICE_DATE", value: convertTimestampToDate(res?.invoiceDate) });
  rows.push({ title: "AST_INVOICE_NUMBER", value: res?.invoiceNumber });
  rows.push({ title: "AST_PURCHASE_DATE", value: convertTimestampToDate(res?.purchaseDate) });
  rows.push({ title: "AST_PURCHASE_ORDER", value: res?.purchaseOrderNumber });
  rows.push({ title: "AST_LIFE", value: res?.lifeOfAsset });
  rows.push({ title: "AST_LOCATION_DETAILS", value: res?.location });
  rows.push({ title: "AST_PURCHASE_COST", value: res?.purchaseCost });
  rows.push({ title: "AST_ACQUISITION_COST", value: res?.acquisitionCost });
  rows.push({ title: "AST_BOOK_VALUE", value: res?.bookValue });
  rows.push({ title: "AST_ORIGINAL_VALUE", value: res?.originalBookValue });
  return rows
}
const extractValue = (key) => {

  if (typeof key === 'object') {
    return key['code']
  }
  return key
}


export const ASSETSearch = {
  all: async (tenantId, filters = {}) => {
    const response = await ASSETService.search({ tenantId, filters });
    return response;
  },

  application: async (tenantId, filters = {}) => {
    const response = await ASSETService.search({ tenantId, filters });
    return response.Assets[0];
  },
  RegistrationDetails: ({ Assets: response, combinedData, t, applicationDetails, maintenanceList, disposalList }) => {

    const formatDate = (epochTime) => {
      if (!epochTime) return '';
      const date = new Date(epochTime);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '/');
    };
    const slotlistRows = applicationDetails?.DepreciationDetails?.map((row) => (
      [
        row.fromDate,
        row.toDate,
        row.depreciationValue,
        row.bookValue,
        row.rate,
        row.depreciationMethod,
        row.oldBookValue,
      ]
    )) || [];
    
    const maintenanceListRows = maintenanceList?.AssetMaintenance?.map((row) => (
      [
        row.vendor,
        row.warrantyStatus,
        row.costOfMaintenance,
        row.maintenanceCycle,
        row.maintenanceType,
        row.postConditionRemarks
      ]
    )) || [];

    const disposalListListRows = disposalList?.AssetDisposals?.map((row) => (
      [
        row.disposalDate,
        row.reasonForDisposal,
        row.glCode,
        row.assetDisposalStatus,
        row.currentAgeOfAsset
      ]
    )) || [];

    return [

      {
        title: "AST_COMMON_DETAILS",
        asSectionHeader: true,
        values: [
          { title: "AST_FINANCIAL_YEAR", value: response?.financialYear },
          { title: "AST_SOURCE_FINANCE", value: response?.sourceOfFinance },
          { title: "AST_APPLICATION_NUMBER", value: response?.applicationNo },
          { title: "AST_BOOK_REF_SERIAL_NUM", value: response?.assetBookRefNo },
          { title: "AST_CATEGORY", value: response?.assetClassification },
          { title: "AST_PARENT_CATEGORY", value: response?.assetParentCategory },
          { title: "AST_SUB_CATEGORY", value: response?.assetCategory },
          { title: "AST_CATEGORY_SUB_CATEGORY", value: response?.assetSubCategory },
          { title: "AST_NAME", value: response?.assetName },
          { title: "ASSET_DESCRIPTION", value: response?.description },
          { title: "AST_DEPARTMENT", value: 'COMMON_MASTERS_DEPARTMENT_' + response?.department },
          { title: "AST_USAGE", value: response?.assetUsage },
          { title: "AST_TYPE", value: response?.assetType },

        ],
      },
      {
        title: "AST_ADDRESS_DETAILS",
        asSectionHeader: true,
        values: [
          { title: "MYCITY_CODE_LABEL", value: response?.addressDetails?.city },
        ],
      },
      {
        title: "AST_DETAILS",
        asSectionHeader: true,
        values: getData(response, combinedData)

      },

      // Conditionally include AST_ALLOCATION_DETAILS
      ...(response?.assetAssignment?.isAssigned
        ? [
          {
            title: "AST_ALLOCATION_DETAILS",
            asSectionHeader: true,
            values: [
              // { title: "AST_EMP_CODE", value: response?.assetAssignment?.employeeCode },
              { title: "AST_ASSIGNED_USER", value: response?.assetAssignment?.assignedUserName },
              { title: "AST_DEPARTMENT", value: response?.assetAssignment?.department },
              { title: "AST_ASSIGNED_DATE", value: formatDate(response?.assetAssignment?.assignedDate) },
              // { title: "AST_DESIGNATION", value: response?.assetAssignment?.designation },
            ],
          }
        ]
        : []),

      {
        title: "AST_DOCUMENT_DETAILS",
        additionalDetails: {

          documents: [
            {

              values: response?.documents
                ?.map((document) => {
                  // console.log("documnet", document);

                  return {
                    title: `ASSET_${document?.documentType}`,
                    documentType: document?.documentType,
                    documentUid: document?.documentUid,
                    fileStoreId: document?.fileStoreId,
                    status: document.status,
                  };
                }),
            },
          ],
        },
      },
      {
        title: "AST_DEPRICIATION",
        asSectionHeader: true,
        isTable: true,
        headers: slotlistRows.length > 0
          ? [
            `${t("START_DATE")}`,
            `${t("END_DATE")}`,
            `${t("DEPRECIATION_VALUE")}`,
            `${t("BOOK_VALUE")}`,
            `${t("RATE")}`,
            `${t("DEPRECIATION_METHOD")}`,
            `${t("OLD_BOOK_VALUE")}`
          ]
          : [`${t("AST_NO_DEPRECIATION_DATA")}`],
        tableRows: slotlistRows,
      },
      {
        title: "AST_MAINTENANCE",
        asSectionHeader: true,
        isTable: true,
        headers: maintenanceListRows.length > 0
          ? [
            `${t("VENDOR")}`,
            `${t("WARRANTY_STATUS")}`,
            `${t("COST_OF_MAINTENANCE")}`,
            `${t("MAINTENANCE_CYCLE")}`,
            `${t("MAINTENANCE_TYPE")}`,
            `${t("POST_CONDITION_REMARKS")}`
          ]
          : [`${t("AST_NO_DEPRECIATION_DATA")}`],
        tableRows: maintenanceListRows,
      },
      {
        title: "AST_DISPOSAL",  
        asSectionHeader: true,
        isTable: true,
        headers: disposalListListRows.length > 0
          ? [
            `${t("DISPOSAL_DATE")}`,
            `${t("REASON_DISPOSAL")}`,
            `${t("GL_CODE")}`,
            `${t("ASSET_DISPOSAL_STATUS")}`,
            `${t("MAINTENANCE_TYPE")}`,
            `${t("AGE_OF_ASSET")}`
          ]
          : [`${t("AST_NO_DEPRECIATION_DATA")}`],
        tableRows: disposalListListRows,
      }
    ];
  },
  applicationDetails: async (t, tenantId, applicationNo, userType, combinedData, args) => {

    const filter = { applicationNo, ...args };
    const response = await ASSETSearch.application(tenantId, filter);
    // Fetch all data depriciation list
    const applicationDetails = await Digit.ASSETService.depriciationList({
      Asset: {
        tenantId,
        id: response?.id,
        accountId: ""
      }
    });
    const maintenanceList = await Digit.ASSETService.maintenanceList({
      AssetMaintenanceSearchCriteria: {
        tenantId,
        assetIds: [response?.id],
        "limit": 10,
        "offset": 0
      }
    });

    const disposalList = await Digit.ASSETService.disposalList({
      searchCriteria: {
        tenantId,
        assetIds: [response?.id],
        fromDate: 1700000000000,
        toDate: 1730000000000,
        reasonForDisposal: "Obsolete, Damaged",
        limit: 10,
        offset: 0
      }
    });
    console.log('disposalList := ', disposalList);
    
    return {
      tenantId: response.tenantId,
      applicationDetails: ASSETSearch.RegistrationDetails({ Assets: response, combinedData, t, applicationDetails, maintenanceList, disposalList}),
      applicationData: response,
      transformToAppDetailsForEmployee: ASSETSearch.RegistrationDetails,

    };
  },
};
