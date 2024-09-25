from typing import List
from langchain_openai import OpenAIEmbeddings

EMBEDDING_MODEL = "text-embedding-3-small"
embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL
)


def get_embedding(text: str) -> List[float]:
    return embeddings.embed_query(text)


def get_embeddings(texts: List[str]) -> List[float]:
    return embeddings.embed_documents(texts)
