INSERT INTO eg_appconfig(id, key_name, description, module) VALUES (nextval('seq_eg_appconfig'), 'IS_ASSET_CODE_AUTOGENERATED', 'Auto/User Generated Asset Code', (select id from eg_module where name='Asset Management'));

--rollback delete from eg_appconfig where key_name='IS_ASSET_CODE_AUTOGENERATED';


