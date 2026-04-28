-- 1. Geographic RBAC
CREATE TABLE ref_zones (
    id SERIAL PRIMARY KEY,
    name_th VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL
);

-- Insert initial zones
INSERT INTO ref_zones (name_th, name_en) VALUES
('สำนักงาน ก.พ. (ส่วนกลาง)', 'OCSC (Central)'),
('สนร. วอชิงตัน', 'OEA Washington'),
('สนร. ลอนดอน', 'OEA London'),
('สนร. แคนเบอร์รา', 'OEA Canberra');

-- Alter user_roles to support Geographic RBAC
ALTER TABLE user_roles ADD COLUMN zone_id INTEGER REFERENCES ref_zones(id) ON DELETE SET NULL;

-- 2. Workflow Engine (Header & Audit)
CREATE TABLE e_form_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES profiles(id) ON DELETE CASCADE,
    form_type VARCHAR(100) NOT NULL, -- e.g., 'EXTENSION', 'STUDY_REPORT'
    current_status VARCHAR(100) NOT NULL DEFAULT 'PENDING',
    current_zone_id INTEGER REFERENCES ref_zones(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for e_form_requests to auto-update updated_at
CREATE TRIGGER set_timestamp_e_form_requests
BEFORE UPDATE ON e_form_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE workflow_approval_logs (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT REFERENCES e_form_requests(id) ON DELETE CASCADE,
    actor_id BIGINT REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Detail Tables (Examples of Preset e-Forms)
CREATE TABLE form_extension_details (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT REFERENCES e_form_requests(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    requested_months INTEGER NOT NULL,
    attached_file_url TEXT
);

CREATE TABLE form_watch_lists (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT REFERENCES e_form_requests(id) ON DELETE CASCADE,
    issue_category VARCHAR(100) NOT NULL, -- 'ACADEMIC', 'HEALTH', 'BEHAVIOR'
    description TEXT NOT NULL,
    severity_level VARCHAR(50) NOT NULL -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
);

-- 4. Bond & Placement Management
CREATE TABLE service_periods (
    id BIGSERIAL PRIMARY KEY,
    award_id BIGINT REFERENCES awards(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    total_required_days INTEGER NOT NULL,
    bond_multiplier INTEGER NOT NULL DEFAULT 1
);

-- 5. State Machine RPC (PL/pgSQL)
CREATE OR REPLACE FUNCTION process_workflow_action(
    p_request_id BIGINT,
    p_actor_id BIGINT,
    p_action VARCHAR,
    p_next_status VARCHAR,
    p_comment TEXT
) RETURNS void AS $$
BEGIN
    -- Update the request status
    UPDATE e_form_requests
    SET current_status = p_next_status,
        updated_at = NOW()
    WHERE id = p_request_id;

    -- Insert audit log
    INSERT INTO workflow_approval_logs (request_id, actor_id, action, comment, created_at)
    VALUES (p_request_id, p_actor_id, p_action, p_comment, NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
