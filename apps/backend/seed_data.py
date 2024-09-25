import random
import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from ask_gov.models import Agency, Topic, Question

Agency.objects.all().delete()
Topic.objects.all().delete()
Question.objects.all().delete()

agencies = [
    ("Ministry of Agriculture and Food Security", "MAFS", "Kementerian Pertanian dan Keterjaminan Makanan"),
    ("Ministry of Communications and Digital", "KOMUNIKASI", "Kementerian Komunikasi dan Digital"),
    ("Ministry of Defence", "MINDEF", "Kementerian Pertahanan"),
    ("Ministry of Domestic Trade and Cost of Living", "KPDN", "Kementerian Perdagangan Dalam Negeri dan Kos Sara Hidup"),
    ("Ministry of Economy", "EKONOMI", "Kementerian Ekonomi"),
    ("Ministry of Education", "MOE", "Kementerian Pendidikan"),
    ("Ministry of Energy Transition and Water Transformation", "PETRA", "Kementerian Peralihan Tenaga dan Transformasi Air"),
    ("Ministry of Entrepreneurship Development and Co-operatives", "MEDC", "Kementerian Pembangunan Usahawan dan Koperasi"),
    ("Ministry of Finance", "MOF", "Kementerian Kewangan"),
    ("Ministry of Foreign Affairs", "MFA", "Kementerian Luar Negeri"),
    ("Ministry of Health", "MOH", "Kementerian Kesihatan"),
    ("Ministry of Higher Education", "MOHE", "Kementerian Pendidikan Tinggi"),
    ("Ministry of Home Affairs", "KDN", "Kementerian Dalam Negeri"),
    ("Ministry of Housing and Local Government", "KPKT", "Kementerian Perumahan dan Kerajaan Tempatan"),
    ("Ministry of Human Resources", "MOHR", "Kementerian Sumber Manusia"),
    ("Ministry of Investment, Trade and Industry", "MITI", "Kementerian Pelaburan, Perdagangan dan Industri"),
    ("Ministry of National Unity", "KPN", "Kementerian Perpaduan Negara"),
    ("Ministry of Natural Resources and Environmental Sustainability", "NRES", "Kementerian Sumber Asli dan Kelestarian Alam Sekitar"),
    ("Ministry of Plantation and Commodities", "MPIC", "Kementerian Perladangan dan Komoditi"),
    ("Ministry of Rural and Regional Development", "KKDW", "Kementerian Pembangunan Luar Bandar dan Wilayah"),
    ("Ministry of Science, Technology and Innovation", "MOSTI", "Kementerian Sains, Teknologi dan Inovasi"),
    ("Ministry of Tourism, Arts and Culture", "MOTAC", "Kementerian Pelancongan, Seni dan Budaya"),
    ("Ministry of Transport", "MOT", "Kementerian Pengangkutan"),
    ("Ministry of Women, Family and Community Development", "KPWKM", "Kementerian Pembangunan Wanita, Keluarga dan Masyarakat"),
    ("Ministry of Works", "KKR", "Kementerian Kerja Raya"),
    ("Ministry of Youth and Sports", "KBS", "Kementerian Belia dan Sukan")
]

for name, acronym, name_ms in agencies:
    agency = Agency.objects.create(name=name, acronym=acronym, name_ms=name_ms)
    print(f'Creating {name} Agency')
    topics = []
    for i in range(1, 11):
        topic = Topic.objects.create(title=f"Topic {i} for {name}", title_ms=f"Topik {i} untuk {name_ms}", agency=agency)
        topics.append(topic)
        print(f"Adding Topic {i} for {name}")

    for j in range(1, 11):
        question = Question.objects.create(
            question=f"Sample question {j} for {name} but we have to make it longer for UI adjustments, this should go as max as 255 chars",
            state="completed",
            agency=agency,
            email=f"sample{j}@example.com",
            answer="In today's rapidly changing world, the concept of lifelong learning has gained significant importance. Lifelong learning refers to the ongoing, voluntary, and self-motivated pursuit of knowledge for personal or professional development. It extends beyond the traditional schooling system and continues throughout an individual's life. The benefits of lifelong learning are manifold, impacting various aspects of personal growth, career advancement, and societal development. One of the primary reasons lifelong learning is crucial is its role in personal development. Engaging in continuous learning helps individuals stay mentally active, fostering a sense of curiosity and wonder. This mental engagement can delay cognitive decline and reduce the risk of mental health issues such as depression and anxiety. Additionally, learning new skills or acquiring new knowledge can boost self-esteem and confidence, empowering individuals to take on new challenges and achieve personal goals. Lifelong learning also plays a pivotal role in career advancement. In an era where technological advancements and industry trends evolve at a breakneck pace, staying updated with the latest skills and knowledge is essential for career growth. Employers value employees who demonstrate a commitment to learning and adaptability. By continuously upgrading their skills, individuals can remain competitive in the job market, increase their employability, and open up new career opportunities. Furthermore, lifelong learning can lead to higher job satisfaction as it allows individuals to explore their interests and passions, aligning their careers with their personal aspirations. Beyond personal and professional growth, lifelong learning has significant societal implications. An educated and knowledgeable population is better equipped to address complex social, economic, and environmental challenges. Lifelong learners are more likely to participate in civic activities, contribute to their communities, and promote positive social change. Moreover, continuous learning fosters innovation and creativity, driving economic development and improving the overall quality of life. One effective approach to lifelong learning is embracing a growth mindset. A growth mindset, as opposed to a fixed mindset, is the belief that abilities and intelligence can be developed through dedication and hard work. This perspective encourages individuals to view challenges as opportunities for growth rather than obstacles. By cultivating a growth mindset, individuals are more likely to seek out new learning experiences, persist in the face of difficulties, and ultimately achieve greater success. Another key aspect of lifelong learning is the availability of diverse learning resources and opportunities. The digital age has democratized access to information, making it easier than ever to learn new skills and acquire knowledge. Online courses, webinars, podcasts, and educational platforms offer flexible and affordable learning options that cater to various learning styles and preferences. Additionally, community centers, libraries, and professional organizations provide valuable resources and support for lifelong learners. Despite the numerous benefits, lifelong learning can be challenging. Time constraints, financial limitations, and lack of motivation are common barriers that individuals may face. However, by setting realistic goals, creating a structured learning plan, and seeking support from peers and mentors, these obstacles can be overcome. It is also important to recognize that lifelong learning is a gradual process, and small, consistent efforts can lead to significant long-term gains. In conclusion, lifelong learning is an invaluable practice that enhances personal development, career advancement, and societal progress. By fostering a growth mindset and leveraging available resources, individuals can embrace continuous learning and unlock their full potential. In a world that is constantly evolving, the ability to adapt and learn is not just an asset but a necessity. Embracing lifelong learning ensures that we remain curious, resilient, and capable of navigating the complexities of the modern world."
        )
        question.topics.set(random.sample(topics, k=random.randint(1, 5)))
        question.save()
        print(f"Creating question ID {question.id}")

print("Successfully seeded agencies, topics, and questions data")
