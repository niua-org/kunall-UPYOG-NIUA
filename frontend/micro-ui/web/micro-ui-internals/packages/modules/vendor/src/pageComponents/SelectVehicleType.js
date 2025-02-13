import React, { useEffect, useState } from "react";
import { CardLabel, Dropdown, LabelFieldPair, TextInput, Loader } from "@nudmcdgnpm/digit-ui-react-components";

const SelectVehicleType = ({ t, config, onSelect, formData, setValue }) => {
  const stateId = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // Fetch Vehicle Data
  const { data: vehicleData, isLoading: vehicleLoading } = Digit.Hooks.fsm.useMDMS(stateId, "Vehicle", "VehicleMakeModel");
  console.log("vehicleData",vehicleData)

  // Fetch Service Type Data
  const { data: serviceTypeData, isLoading: serviceLoading } = Digit.Hooks.useCustomMDMS(tenantId, "tenant", [{ name: "citymodule" }], {
    select: (data) => data?.tenant?.citymodule,
  });

  console.log("serviceTypeData",serviceTypeData)

  const [serviceTypeFilters, setServiceTypeFilters] = useState({});
  const [modals, setModals] = useState([]);
  const [selectedModal, setSelectedModal] = useState({});
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState({});
  const [selectedCapacity, setSelectedCapacity] = useState("");

  // Get selected service type from formData
  const selectedServiceType = formData?.serviceType?.code;

  // Dynamically build the Service Type - Vehicle Model mapping
  useEffect(() => {
    if (serviceTypeData && vehicleData) {
      const filters = {};

      // Example logic: You can update this based on actual data relationships
      serviceTypeData.forEach(service => {
        if (service.code === "WT") {
          filters[service.code] = ["TANKER"];
        } else if (service.code === "FSM") {
          filters[service.code] = vehicleData
            .filter(vehicle => ["MAHINDRA", "TATA", "TRACTOR", "TAFE", "SONALIKA"].includes(vehicle.code))
            .map(vehicle => vehicle.code);
        }
      });

      setServiceTypeFilters(filters);
    }
  }, [serviceTypeData, vehicleData]);

  //  Update the Model dropdown based on selected Service Type
  useEffect(() => {
    if (vehicleData) {
      const allowedModels = serviceTypeFilters[selectedServiceType] || [];
      const filteredModals = vehicleData.filter(vehicle => allowedModels.includes(vehicle.code));

      setModals(filteredModals);
      setSelectedModal({});
      setTypes([]);
      setSelectedType({});
      setSelectedCapacity("");
    }
  }, [vehicleData, selectedServiceType, serviceTypeFilters]);

  // Update the Vehicle Type dropdown based on selected Model
  useEffect(() => {
    if (vehicleData && selectedModal?.code) {
      const filteredTypes = vehicleData.filter(vehicle => vehicle.make === selectedModal.code);
      setTypes(filteredTypes);
      setSelectedType({});
      setSelectedCapacity("");
    }
  }, [selectedModal]);

  // Set the Capacity when a Type is selected
  useEffect(() => {
    if (selectedType?.capacity) {
      setSelectedCapacity(selectedType.capacity);
    }
  }, [selectedType]);

  // Handler for selecting a Model
  const selectModal = (modal) => {
    setSelectedModal(modal);
    onSelect(config.key, { ...formData[config.key], modal: modal, type: "" });
  };

  // Handler for selecting a Vehicle Type
  const selectType = (type) => {
    setSelectedType(type);
    setSelectedCapacity(type.capacity);
    onSelect(config.key, { ...formData[config.key], type: type });
  };

  if (vehicleLoading || serviceLoading) {
    return <Loader />;
  }

  return (
    <div>
      {/* Vehicle Model Dropdown (Filtered based on Service Type) */}
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">
          {t("ES_FSM_REGISTRY_VEHICLE_MODEL")}
        </CardLabel>
        <Dropdown
          className="form-field"
          selected={selectedModal}
          option={modals}
          select={selectModal}
          optionKey="name"
          t={t}
        />
      </LabelFieldPair>

      {/* Vehicle Type Dropdown (Filtered based on Model) */}
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">
          {t("ES_FSM_REGISTRY_VEHICLE_TYPE")}
        </CardLabel>
        <Dropdown
          className="form-field"
          selected={selectedType}
          option={types}
          select={selectType}
          optionKey="name"
          t={t}
        />
      </LabelFieldPair>

      {/* Vehicle Capacity Input (Set Automatically Based on Type) */}
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">
          {t("ES_FSM_REGISTRY_VEHICLE_CAPACITY")}
        </CardLabel>
        <TextInput
          className=""
          textInputStyle={{ width: "50%" }}
          value={selectedCapacity}
          disable={true}
        />
      </LabelFieldPair>
    </div>
  );
};

export default SelectVehicleType;
