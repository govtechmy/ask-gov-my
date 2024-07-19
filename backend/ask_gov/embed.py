from typing import List
from langchain_openai import OpenAIEmbeddings

EMBEDDING_MODEL = "text-embedding-3-small"


def get_embeddings(text: str) -> List[float]:
    embeddings = OpenAIEmbeddings(EMBEDDING_MODEL)
    return embeddings.embed_query(text)
