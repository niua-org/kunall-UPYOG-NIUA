import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import PayersDetails from './payers-details'

import { MyBills } from "./bills";
import { SelectPaymentType } from "./payment-type/index";
import { SuccessfulPayment, FailedPayment } from "./response";

const CitizenPayment = ({ stateCode, cityCode, moduleCode }) => {
  const { path: currentPath } = useRouteMatch();
  const commonProps = { stateCode, cityCode, moduleCode };
  console.log("payment redirect");
    console.log("currentpath",${currentPath});
  return (
    <React.Fragment>
      <Switch>
        <Route path={`${currentPath}/my-bills/:businessService`}>
          <MyBills stateCode={stateCode} />
        </Route>
        <Route  path={`${currentPath}/billDetails/:businessService/:consumerCode/:paymentAmt`}>
          <PayersDetails  {...commonProps} stateCode={stateCode} basePath={currentPath}  />
        </Route>
        <Route path={`${currentPath}/collect/:businessService/:consumerCode`}>
          <SelectPaymentType {...commonProps} stateCode={stateCode} basePath={currentPath} />
        </Route>
        <Route path={`${currentPath}/success/:businessService/:consumerCode/:tenantId`}>
          <SuccessfulPayment {...commonProps} />
        </Route>
        <Route path={`${currentPath}/failure`}>
          <FailedPayment {...commonProps} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};

export default CitizenPayment;
