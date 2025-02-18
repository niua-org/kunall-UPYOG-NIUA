CREATE TABLE ug_cnd_application_details= (
    application_id VARCHAR(64) PRIMARY KEY,  -- Using application_id as the primary key
    tenant_id VARCHAR(64) NOT NULL,
    application_number VARCHAR(64) UNIQUE NOT NULL,
    application_type VARCHAR(50) NOT NULL, -- Assuming it will be ENUM
    type_of_construction VARCHAR(255),
    deposit_centre_details TEXT,
    applicant_detail_id VARCHAR(64),
    requested_pickup_date DATE,
    application_status VARCHAR(50), -- TODO: Convert to ENUM later
    additional_details JSONB,
    house_area BIGINT,
    construction_from_date DATE,
    construction_to_date DATE,
    property_type VARCHAR(255),
    total_waste_quantity DECIMAL(10,2),
    no_of_trips INTEGER,
    vehicle_id VARCHAR(64),
    vendor_id VARCHAR(64),
    pickup_date DATE,
    completed_on TIMESTAMP,

    created_by VARCHAR(64),
    last_modified_by VARCHAR(64),
    created_time BIGINT,
    last_modified_time BIGINT
);


CREATE TABLE ug_cnd_waste_detail (
    application_id VARCHAR(64) NOT NULL,
    waste_type_id VARCHAR(64) NOT NULL,
    entered_by_user_type VARCHAR(50) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    metrics VARCHAR(50) NOT NULL,
    created_by VARCHAR(64),
    last_modified_by VARCHAR(64),
    created_time BIGINT,
    last_modified_time BIGINT

    PRIMARY KEY (application_id, waste_type_id),
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
);


CREATE TABLE ug_cnd_document_detail (
    document_detail_id VARCHAR(64) PRIMARY KEY,
    application_id VARCHAR(64) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    uploaded_by_user_type VARCHAR(50) NOT NULL,
    file_store_id VARCHAR(64) NOT NULL,

    created_by VARCHAR(64),
    last_modified_by VARCHAR(64),
    created_time BIGINT,
    last_modified_time BIGINT,

    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
);


CREATE TABLE ug_cnd_disposal_deposit_centre_detail (
    disposal_id VARCHAR(64) PRIMARY KEY,
    application_id VARCHAR(64) NOT NULL,
    vehicle_id VARCHAR(64),
    vehicle_depot_no VARCHAR(100),
    net_weight DECIMAL(10,2),
    gross_weight DECIMAL(10,2),
    dumping_station_name VARCHAR(255),
    disposal_date TIMESTAMP,
    disposal_type VARCHAR(100),
    name_of_disposal_site VARCHAR(255),

    created_by VARCHAR(64),
    last_modified_by VARCHAR(64),
    created_time BIGINT,
    last_modified_time BIGINT,

    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
);


