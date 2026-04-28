-- ฟังก์ชันกลางสำหรับการ Update Timestamp อัตโนมัติ (Trigger)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Reference Tables (ตารางอ้างอิง - Lookup Tables)
CREATE TABLE ref_genders (
    id SERIAL PRIMARY KEY,
    name_th VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL
);

CREATE TABLE ref_application_statuses (
    id SERIAL PRIMARY KEY,
    name_th VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL
);

CREATE TABLE ref_award_statuses (
    id SERIAL PRIMARY KEY,
    name_th VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL
);

CREATE TABLE ref_payment_types (
    id SERIAL PRIMARY KEY,
    name_th VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL
);

CREATE TABLE ref_expense_categories (
    id SERIAL PRIMARY KEY,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL
);

CREATE TABLE ref_tracking_cycles (
    id SERIAL PRIMARY KEY,
    name_th VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL
);

CREATE TABLE ref_contract_statuses (
    id SERIAL PRIMARY KEY,
    name_th VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL
);

CREATE TABLE ref_transaction_statuses (
    id SERIAL PRIMARY KEY,
    name_th VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL
);

CREATE TABLE ref_education_levels (
    id SERIAL PRIMARY KEY,
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL
);

-- Profiles & RBAC
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, 
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE profiles (
    id BIGSERIAL PRIMARY KEY,
    auth_user_id UUID UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    citizen_id VARCHAR(13) UNIQUE,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    gender_id INTEGER REFERENCES ref_genders(id),
    nationality VARCHAR(100) DEFAULT 'Thai',
    avatar_url TEXT,
    address_json JSONB DEFAULT '{}'::jsonb, 
    emergency_contact_json JSONB DEFAULT '{}'::jsonb,
    bank_account_json JSONB DEFAULT '{}'::jsonb, 
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE user_roles (
    user_id BIGINT REFERENCES profiles(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Master Data
CREATE TABLE master_scholarships (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    requirements_json JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by BIGINT REFERENCES profiles(id),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE master_institutions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    ranking_info JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE master_faculties (
    id BIGSERIAL PRIMARY KEY,
    institution_id BIGINT REFERENCES master_institutions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Applications
CREATE TABLE applications (
    id BIGSERIAL PRIMARY KEY,
    application_code VARCHAR(50) UNIQUE NOT NULL,
    applicant_id BIGINT REFERENCES profiles(id),
    scholarship_type_id BIGINT REFERENCES master_scholarships(id),
    education_level_id INTEGER REFERENCES ref_education_levels(id),
    current_school_university VARCHAR(255),
    gpa DECIMAL(3,2),
    english_proficiency_json JSONB,
    work_experience_json JSONB DEFAULT '[]'::jsonb,
    target_university_id BIGINT REFERENCES master_institutions(id),
    target_faculty_id BIGINT REFERENCES master_faculties(id),
    status_id INTEGER REFERENCES ref_application_statuses(id),
    reviewer_score DECIMAL(5,2),
    interview_score DECIMAL(5,2),
    rejection_reason TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_by BIGINT REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Awards & Contracts
CREATE TABLE awards (
    id BIGSERIAL PRIMARY KEY,
    award_code VARCHAR(50) UNIQUE NOT NULL,
    application_id BIGINT REFERENCES applications(id),
    recipient_id BIGINT REFERENCES profiles(id),
    university_id BIGINT REFERENCES master_institutions(id),
    faculty_id BIGINT REFERENCES master_faculties(id),
    budget_year VARCHAR(4) NOT NULL, 
    total_amount DECIMAL(15,2) NOT NULL,
    duration_months INTEGER NOT NULL,
    start_date DATE,
    end_date DATE,
    advisor_name VARCHAR(255),
    advisor_email VARCHAR(255),
    study_plan_url TEXT,
    payment_type_id INTEGER REFERENCES ref_payment_types(id),
    tracking_cycle_id INTEGER REFERENCES ref_tracking_cycles(id),
    status_id INTEGER REFERENCES ref_award_statuses(id),
    special_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by BIGINT REFERENCES profiles(id),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE contracts (
    id BIGSERIAL PRIMARY KEY,
    award_id BIGINT REFERENCES awards(id) ON DELETE CASCADE,
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    status_id INTEGER REFERENCES ref_contract_statuses(id),
    guarantee_amount DECIMAL(15,2) NOT NULL,
    guarantors_json JSONB NOT NULL DEFAULT '[]'::jsonb, 
    signed_date DATE,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by BIGINT REFERENCES profiles(id),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TRIGGER update_awards_updated_at BEFORE UPDATE ON awards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Payments
CREATE TABLE payment_plans (
    id BIGSERIAL PRIMARY KEY,
    award_id BIGINT REFERENCES awards(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL,
    fiscal_year VARCHAR(4) NOT NULL, 
    expense_category_id INTEGER REFERENCES ref_expense_categories(id),
    amount DECIMAL(15,2) NOT NULL,
    expected_date DATE NOT NULL,
    is_milestone_required BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payment_transactions (
    id BIGSERIAL PRIMARY KEY,
    plan_id BIGINT REFERENCES payment_plans(id),
    amount_paid DECIMAL(15,2) NOT NULL,
    paid_date TIMESTAMP WITH TIME ZONE,
    status_id INTEGER REFERENCES ref_transaction_statuses(id),
    slip_url TEXT,
    transfer_reference VARCHAR(100),
    approver_id BIGINT REFERENCES profiles(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_payment_plans_updated_at BEFORE UPDATE ON payment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tracking
CREATE TABLE academic_reports (
    id BIGSERIAL PRIMARY KEY,
    award_id BIGINT REFERENCES awards(id) ON DELETE CASCADE,
    academic_year VARCHAR(10),
    semester VARCHAR(10),
    gpa DECIMAL(3,2),
    credits_earned INTEGER,
    credits_total INTEGER,
    scholar_comments TEXT, 
    transcript_url TEXT,
    warning_status VARCHAR(50), 
    status_id INTEGER REFERENCES ref_application_statuses(id),
    reviewer_comments TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by BIGINT REFERENCES profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_academic_reports_updated_at BEFORE UPDATE ON academic_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth_user_id = auth.uid());
