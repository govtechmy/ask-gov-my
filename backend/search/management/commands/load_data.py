from elasticsearch import Elasticsearch
# from search.es import bonsai
from django.core.management.base import BaseCommand, CommandError

import requests

slug = 'govtech'
PLANE_PUBLIC_API_KEY = "plane_api_35c9b24dca594bd69810ff63ddbbf446"
#url = f'https://api.plane.so/api/v1/workspaces/{slug}/projects/'
#r = requests.get(url=url, headers=f'x-api-key: {PLANE_PUBLIC_API_KEY}')
#print(r)


url = f"https://api.plane.so/api/v1/workspaces/{slug}/projects/"

headers = {"x-api-key": f"{PLANE_PUBLIC_API_KEY}"}

r = requests.get(url=url, headers=headers)
print(r.json())


class Command(BaseCommand):
    help = "Closes the specified poll for voting"

    def add_arguments(self, parser):
        pass
        # parser.add_argument("poll_ids", nargs="+", type=int)

    def handle(self, *args, **options):
        bonsai = Elasticsearch(
            'https://k0nxeh9mmq:uao3y6zftt@govtech-nucleus-unit-1660186680.us-east-1.bonsaisearch.net:443',
        )
        # print(bonsai.info())
        bonsai.indices.delete(index='agencies', ignore_unavailable=True)
        bonsai.indices.create(index='agencies')
        data = r.json()['results']
        bonsai.index(index='agencies', body=data)
