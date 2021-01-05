--liquibase formatted sql

--changeset p.milosevic:1

CREATE TABLE safetag.audit_factory_items (
	afi_fi_id int8 NOT NULL,
	afi_a_id int4 NOT NULL,
	afi_desc varchar(255) NULL,
	afi_tree_history varchar(100) NULL,
	afi_status int2 NOT NULL,
	CONSTRAINT pk_afi_a_id__afi_fi_id PRIMARY KEY (afi_a_id, afi_fi_id)
);

CREATE TABLE safetag.audits (
	a_id serial NOT NULL,
	a_create_by int8 NULL,
	a_assign_to int8 NULL,
	a_status int8 NULL,
	a_name varchar(50) NOT NULL,
	a_indt timestamp NULL DEFAULT timezone('utc'::text, now()),
	CONSTRAINT pk_a_id PRIMARY KEY (a_id)
);

CREATE TABLE safetag.classification_type (
	ct_id serial NOT NULL,
	ct_name varchar(20) NULL,
	ct_desc varchar(255) NULL,
	CONSTRAINT pk_ct_id PRIMARY KEY (ct_id)
);

CREATE TABLE safetag.classifications (
	c_id serial NOT NULL,
	c_parent_id int4 NULL,
	c_root_id int4 NULL,
	c_ct_id int4 NOT NULL,
	c_f_id int4 NOT NULL,
	c_name varchar(50) NOT NULL,
	c_desc varchar(255) NULL,
	c_indt timestamp NULL DEFAULT timezone('utc'::text, now()),
	c_is_active bool NULL,
	CONSTRAINT pk_c_id PRIMARY KEY (c_id)
);

CREATE TABLE safetag.configs (
	c_param varchar(25) NOT NULL,
	c_value varchar(255) NULL,
	c_desc varchar(255) NULL,
	CONSTRAINT pk_c_param PRIMARY KEY (c_param)
);

CREATE TABLE safetag.factories (
	f_id serial NOT NULL,
	f_name varchar(50) NOT NULL,
	f_address varchar(255) NOT NULL,
	f_phone varchar(25) NULL,
	f_info varchar(255) NULL,
	f_indt timestamp NULL DEFAULT timezone('utc'::text, now()),
	f_updt timestamp NULL,
	f_licence_paid bool NOT NULL DEFAULT false,
	CONSTRAINT pk_f_id PRIMARY KEY (f_id)
);


CREATE TABLE safetag.massage_type (
	mst_id int2 NOT NULL,
	mst_name varchar(30) NULL,
	CONSTRAINT pk_mst_id PRIMARY KEY (mst_id)
);


CREATE TABLE safetag.roles (
	r_id smallserial NOT NULL,
	r_name varchar(20) NULL,
	CONSTRAINT pk_r_id PRIMARY KEY (r_id)
);

CREATE TABLE safetag.tag_status (
	ts_id smallserial NOT NULL,
	ts_name varchar(25) NULL,
	CONSTRAINT pk_ts_id PRIMARY KEY (ts_id)
);


CREATE TABLE safetag.factory_items (
	fi_id bigserial NOT NULL,
	fi_parent_id int8 NULL,
	fi_root_id int8 NULL,
	fi_f_id int4 NULL,
	fi_image varchar(50) NULL,
	fi_code_desc varchar(20) NULL,
	fi_desc varchar(255) NULL,
	fi_is_active bool NULL,
	CONSTRAINT pk_fi_id PRIMARY KEY (fi_id),
	CONSTRAINT fk_fi_f_id__f_id FOREIGN KEY (fi_f_id) REFERENCES factories(f_id)
);

CREATE TABLE safetag.users (
	u_id bigserial NOT NULL,
	u_f_id int4 NULL,
	u_working_place varchar(255) NULL,
	u_r_id int2 NOT NULL,
	u_name varchar(50) NOT NULL,
	u_lastname varchar(50) NOT NULL,
	u_email varchar(255) NOT NULL,
	u_pass varchar(60) NOT NULL,
	u_phone varchar(20) NULL,
	u_indt timestamp NULL DEFAULT timezone('utc'::text, now()),
	u_is_online bool NULL,
	u_is_active bool NULL,
	CONSTRAINT pk_u_id PRIMARY KEY (u_id),
	CONSTRAINT fk_u_f_id__f_id FOREIGN KEY (u_f_id) REFERENCES factories(f_id),
	CONSTRAINT fk_u_r_id__r_id FOREIGN KEY (u_r_id) REFERENCES roles(r_id)
);


CREATE TABLE safetag.user_sessions (
	us_id bigserial NOT NULL,
	us_u_id int8 NOT NULL,
	us_token varchar(60) NOT NULL,
	us_is_mobile bool NULL,
	us_startdt timestamp NOT NULL DEFAULT timezone('utc'::text, now()),
	us_enddt timestamp NULL,
	CONSTRAINT pk_us_id PRIMARY KEY (us_id),
	CONSTRAINT fk_us_u_id__u_id FOREIGN KEY (us_u_id) REFERENCES users(u_id)
);


CREATE TABLE safetag.massages (
	ms_id int8 NOT NULL,
	ms_msg varchar(255) NOT NULL,
	ms_mst_id int2 NOT NULL,
	ms_u_id int8 NOT NULL,
	ms_t_id int8 NULL
);


CREATE TABLE safetag.tags (
	t_id bigserial NOT NULL,
	t_c_id int4 NOT NULL,
	t_fi_id int8 NOT NULL,
	t_f_id int4 NOT NULL,
	t_create_by int8 NULL,
	t_assign_to int8 NULL,
	t_manager int8 NULL,
	t_ts_id int2 NULL,
	t_rist_level int2 NOT NULL,
	t_enddt timestamp NULL,
	t_indt timestamp NULL DEFAULT timezone('utc'::text, now()),
	CONSTRAINT pk_t_id PRIMARY KEY (t_id)
);


ALTER TABLE safetag.massages ADD CONSTRAINT fk_ms_t_id__t_id FOREIGN KEY (ms_t_id) REFERENCES tags(t_id);
ALTER TABLE safetag.massages ADD CONSTRAINT fk_ms_u_id__u_id FOREIGN KEY (ms_u_id) REFERENCES users(u_id);
ALTER TABLE safetag.tags ADD CONSTRAINT fk_t_assign_to__u_id FOREIGN KEY (t_assign_to) REFERENCES users(u_id);
ALTER TABLE safetag.tags ADD CONSTRAINT fk_t_c_id__c_id FOREIGN KEY (t_c_id) REFERENCES classifications(c_id);
ALTER TABLE safetag.tags ADD CONSTRAINT fk_t_create_by__u_id FOREIGN KEY (t_create_by) REFERENCES users(u_id);
ALTER TABLE safetag.tags ADD CONSTRAINT fk_t_f_id__f_id FOREIGN KEY (t_f_id) REFERENCES factories(f_id);
ALTER TABLE safetag.tags ADD CONSTRAINT fk_t_fi_id__fi_id FOREIGN KEY (t_fi_id) REFERENCES factory_items(fi_id);
ALTER TABLE safetag.tags ADD CONSTRAINT fk_t_manager__u_id FOREIGN KEY (t_manager) REFERENCES users(u_id);
ALTER TABLE safetag.tags ADD CONSTRAINT fk_t_ts_id__ts_id FOREIGN KEY (t_ts_id) REFERENCES tag_status(ts_id);
ALTER TABLE safetag.classifications ADD CONSTRAINT fk_c_ct_id__c_id FOREIGN KEY (c_ct_id) REFERENCES classification_type(ct_id);
ALTER TABLE safetag.classifications ADD CONSTRAINT fk_c_f_id__f_id FOREIGN KEY (c_f_id) REFERENCES factories(f_id);
ALTER TABLE safetag.audit_factory_items ADD CONSTRAINT fk_afi_a_id__a_id FOREIGN KEY (afi_a_id) REFERENCES audits(a_id);
ALTER TABLE safetag.audit_factory_items ADD CONSTRAINT fk_afi_fi_id__fi_id FOREIGN KEY (afi_fi_id) REFERENCES factory_items(fi_id);
ALTER TABLE safetag.audits ADD CONSTRAINT fk_a_assign_to__u_id FOREIGN KEY (a_assign_to) REFERENCES users(u_id);
ALTER TABLE safetag.audits ADD CONSTRAINT fk_a_created_by__u_id FOREIGN KEY (a_create_by) REFERENCES users(u_id);