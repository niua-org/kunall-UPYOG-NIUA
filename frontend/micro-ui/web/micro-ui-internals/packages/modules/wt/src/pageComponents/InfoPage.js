import { Card, CardHeader, CardText, SubmitBar } from "@nudmcdgnpm/digit-ui-react-components";
import React, { useState } from "react";
import BookingPopup from "../components/BookingPopup";

// First component which will show the details for the application form

const InfoPage = ({ t, onSelect, formData, config, userType }) => {
  const [existingDataSet, setExistingDataSet] = useState("");
  const [showModal, setShowModal] = useState(false);
  let index = 0;
  sessionStorage.removeItem("docReqScreenByBack"); // Remove item from session storage

  // Function to open the BookingPopup
  const handleOpenModal = () => {
    setShowModal(true);
  };
  // Function to handle the next action
  const goNext = () => {
    let owner = formData.infodetails && formData.infodetails[index];
    let ownerStep;
    if (userType === "citizen") {
      ownerStep = { ...owner, existingDataSet };
      onSelect(config.key, { ...formData[config.key], ...ownerStep }, false, index);
    } else {
      ownerStep = { ...owner, existingDataSet };
      onSelect(config.key, ownerStep, false, index);
    }
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader>{t("MODULE_WT")}</CardHeader>
        <div>
          <CardText className={"primaryColor"}>{t("SV_DOC_REQ_SCREEN_SUB_HEADER")}</CardText>
          <CardText className={"primaryColor"}>{t("SV_DOC_REQ_SCREEN_TEXT")}</CardText>
          <CardText className={"primaryColor"}>{t("SV_DOC_REQ_SCREEN_SUB_TEXT")}</CardText>
        </div>
        <span>
          <SubmitBar label={t("COMMON_NEXT")} onSubmit={handleOpenModal} />
        </span>
      </Card>

      {showModal && (
        <BookingPopup
          t={t}
          closeModal={() => setShowModal(false)}
          actionCancelOnSubmit={() => setShowModal(false)}
          onSubmit={() => {
            goNext();
            setShowModal(false);
          }}
          setExistingDataSet={setExistingDataSet} // Pass the setExistingDataSet function
        />
      )}
    </React.Fragment>
  );
};

export default InfoPage;
