from elasticsearch import Elasticsearch

ELASTICSEARCH_URL = "https://askgov-fc58f6.es.us-east-1.aws.elastic.cloud"
ELASTICSEARCH_API_KEY = "NWNHNVRaQUI3cVdKTXhCbHk4Sl86Um1LTmRKNjFSMjJXeUVtNGFVMEtldw=="

client = Elasticsearch(
    [ELASTICSEARCH_URL],
    api_key=ELASTICSEARCH_API_KEY,
)
