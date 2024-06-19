import requests

SLUG = 'govtech'
PLANE_PUBLIC_API_KEY = "plane_api_35c9b24dca594bd69810ff63ddbbf446"
PLANE_URL = 'https://api.plane.so/'


class Plane:
    headers = {"x-api-key": f"{PLANE_PUBLIC_API_KEY}"}
    slug = SLUG
    plane_url = PLANE_URL

    def get_agencies(self):
        url = f"{self.plane_url}api/v1/workspaces/{self.slug}/projects/"
        r = requests.get(url=url, headers=self.headers)
        res = r.json()['results']
        # for r in res:
        #     print(r['id'], r['name'])
        return res

    def get_questions(self):
        agencies_id = [a['id'] for a in self.get_agencies()]
        # print(agencies_id)
        for a in agencies_id:
            url = f"{self.plane_url}api/v1/workspaces/{self.slug}/projects/{a}/issues/"
            r = requests.get(url=url, headers=self.headers)
            res = r.json()['results']
            for r in res:
                print(r)
                print('\n')

    def get_question_by_agency(self, id):
        url = f"{self.plane_url}api/v1/workspaces/{self.slug}/projects/{id}/issues/"
        r = requests.get(url=url, headers=self.headers)
        return r.json()

    def get_question_and_answers(self, agency_id, question_id):
        url = f"https://api.plane.so/api/v1/workspaces/{self.slug}/projects/{agency_id}/issues/{question_id}/comments/"
        r = requests.get(url=url, headers=self.headers)
        return r.json()


if __name__ == '__main__':
    pl = Plane()
    # pl.get_agencies()
    pl.get_questions()
