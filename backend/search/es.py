import requests
from elasticsearch import Elasticsearch

ES_API = 'aUJhckQ1QUJLTE1YeFhaSW5CcGw6VkVPbzBFN3FTeDJZMjFiU0hwNENUUQ=='
CONN = 'https://3bf1318d9d5d468180ad45f7ed03ea23.us-central1.gcp.cloud.es.io:443'
BONSAI_URL = 'https://k0nxeh9mmq:uao3y6zftt@govtech-nucleus-unit-1660186680.us-east-1.bonsaisearch.net:443',

'''
HOW TO CONNECT?

For elastico:
elasco = Elasticsearch(
    CONN,
    api_key=ES_API,
)

For bonsai
bonsai = Elasticsearch(
    BONSAI_URL
)
'''


def get_agency_data():
    slug = 'govtech'
    PLANE_PUBLIC_API_KEY = "plane_api_35c9b24dca594bd69810ff63ddbbf446"

    url = f"https://api.plane.so/api/v1/workspaces/{slug}/projects/"

    headers = {"x-api-key": f"{PLANE_PUBLIC_API_KEY}"}

    r = requests.get(url=url, headers=headers)
    # print(r.json())
    return r.json()['results']


class BonsaiSearch:
    def __init__(self, url=BONSAI_URL):
        self.es = Elasticsearch(url)

    def info(self):
        return self.es.info()

    def create_index(self, index_name):
        return self.es.indices.create(index=index_name)

    def index(self, index_name, id, document):
        return self.es.index(
            index=index_name,
            id=id,
            doc=document
        )

    def delete_index(self, index_name):
        return self.es.indices.delete(index=index_name)


if __name__ == '__main__':
    es = BonsaiSearch()
    print(es.info())

    # create = es.create_index('askgovvmy')
    # print(create)

    agencies = get_agency_data()
    # print(agencies)

    indexing = es.index(index_name='askgovvmy', id=1, document=agencies)
    print(indexing)

    delete = es.delete_index('askgovvmy')
    print(delete)
