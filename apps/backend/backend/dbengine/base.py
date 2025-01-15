"""
We subclass Django's database backend with a database wrapper so it can fetch credentials from AWS Secrets Manager.
See: https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/rotate-database-credentials-without-restarting-containers.html
"""

import logging
logger = logging.getLogger(__name__)

import botocore
import botocore.session
from aws_secretsmanager_caching import SecretCache, SecretCacheConfig

from django.db.backends.postgresql import base
from psycopg2 import OperationalError, errorcodes

import json

from backend.settings import DATABASE_SECRETSMANAGER_ARN

class DatabaseCredentials:
    def __init__(self):
        client = botocore.session.get_session().create_client('secretsmanager')
        cache_config = SecretCacheConfig()
        self.cache_secrets_manager = SecretCache(config=cache_config, client=client)
        self.secret_id = DATABASE_SECRETSMANAGER_ARN

    def get_conn_params_from_secrets_manager(self, conn_params):
        secret_json=self.cache_secrets_manager.get_secret_string(self.secret_id)
        secret_dict=json.loads(secret_json)
        username=secret_dict["username"]
        password=secret_dict["password"]
        conn_params['user']=username
        conn_params['password']=password
        return

    def refresh_now(self):
        secret_cache_item=self.cache_secrets_manager._get_cached_secret(self.secret_id)
        secret_cache_item._refresh_needed=True
        secret_cache_item._execute_refresh()

databasecredentials = DatabaseCredentials()

class DatabaseWrapper(base.DatabaseWrapper):
    def get_new_connection(self, conn_params):
        if not DATABASE_SECRETSMANAGER_ARN:
            return super(DatabaseWrapper, self).get_new_connection(conn_params)

        try:
            logger.info(f"Getting database credentials from AWS Secrets Manager ({DATABASE_SECRETSMANAGER_ARN})")
            databasecredentials.get_conn_params_from_secrets_manager(conn_params)
            conn = super(DatabaseWrapper, self).get_new_connection(conn_params)
            return conn
        except OperationalError as e:
            error_code = e.pgcode
            if not (
                error_code == errorcodes.INVALID_AUTHORIZATION_SPECIFICATION 
                or error_code == errorcodes.INVALID_PASSWORD
                or "authentication failed" in str(e)
            ):
                raise e

            databasecredentials.refresh_now()
            databasecredentials.get_conn_params_from_secrets_manager(conn_params) 
            conn = super(DatabaseWrapper, self).get_new_connection(conn_params)
            return conn
