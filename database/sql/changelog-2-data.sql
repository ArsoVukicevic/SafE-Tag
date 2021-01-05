--liquibase formatted sql

--changeset p.milosevic:2
INSERT INTO safetag.classification_type (ct_name,ct_desc) VALUES 
('NU','Nu desc')
,('NP','Np desc')
,('NM','Nm desc');

INSERT INTO safetag.configs (c_param,c_value,c_desc) VALUES 
('one_signal_app_id','one_signal_app_id_value','App id for one signal')
,('ws_host_1','{"port":8090,"host":"<socket_host>"}','web soccet host for factory with id 1');

INSERT INTO safetag.massage_type (mst_id,mst_name) VALUES 
(1,'Text')
,(2,'Img')
,(3,'Text on Description screen')
,(4,'Img on Description screen')
,(5,'Text on Instruction screen')
,(6,'Img on Instruction screen');

INSERT INTO safetag.roles (r_name) VALUES 
('Owner')
,('Admin')
,('Manager')
,('Employee');

INSERT INTO safetag.tag_status (ts_name) VALUES 
('Open')
,('Assigned')
,('In Progress')
,('Closed');

INSERT INTO safetag.users (u_f_id,u_working_place,u_r_id,u_name,u_lastname,u_email,u_pass,u_phone,u_indt,u_is_online,u_is_active) VALUES
(NULL,'Application owner',1,'user123','user123','powner@gmail.com','$2y$10$oZZUaPVsQlnfObOHmM3Uyufjy5u1x9LO3tBEq1vzbOe5BkVn6rg56','06452896953','2020-01-06 12:02:31.927',true,true);