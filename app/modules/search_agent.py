from util.model.oci_openai_client import LLM_Open_Client
from langgraph.prebuilt import create_react_agent
from pydantic import BaseModel
from typing import Literal, List
import logging
import re

logger = logging.getLogger(name=f"{__name__}")

class Query_Fields(BaseModel):
    year: str = "All"
    type: Literal['','loss','win','no_bid'] = ''
    region: str = ''
    customer: str = ''
    product: str = ''
    endYear: str = "All"

class Search_Query(BaseModel):
    search_dict: List[Query_Fields]

class SearchAgent:
    """ Search agent in charge of generating the dictionary for the DB """

    _instance = None
    _initialized = False

    FORMAT_INSTRUCTION = ("""
        For any user query, generate a list of [year, type, region, customer, product] by following these strict rules:

        - For each field, ONLY use information that is explicitly and unambiguously stated in the user's query.
        - **Do NOT infer or guess any field value based on wording, general knowledge, phrasing, or common patterns.**
        - If a field is not explicitly stated or cannot be directly derived (e.g., from a city→country mapping for region), set its value to '' (empty string), except for year as specified below.
        - For 'year': Use the format yyyy only if a specific year is clearly provided. If no year is mentioned, set to 'All'.
        - For 'type': Only populate this field if an explicit document type is specifically mentioned in the query (win,loss,no_bid). General terms like "main documents", "files", "reports", "examples" must NOT be interpreted as a document type. If type is not clearly stated, set to '' (empty string).
        - For 'region': Use the correct two-letter country code ONLY if a specific country, city, or state is stated. If no location is provided or it cannot be mapped to a country, set to '' (empty string).
        - For 'customer': Only use the customer's name if it is explicitly provided. Otherwise, set to '' (empty string).
        - For 'product': Only use the product name if it is explicitly provided. Otherwise, set to '' (empty string).
        - For 'endYear': Use the format yyyy only if a specific year is clearly provided. If no year is mentioned, set to 'All'.

        NEVER fill a field with a default or inferred value except for 'year', which should be 'All' if missing.

        Example:
        Prompt: "Main documents in Australia"
        => Output: ['All', '', 'AU', '', '']
    """)

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SearchAgent,cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self.oci_client = LLM_Open_Client()
            self.model = self.oci_client.build_llm_client()
            self.create_agent()
            SearchAgent._initialized = True
    SYSTEM_INSTRUCTION = (
        "You are an agent in charge of converting a user natural language prompt into a list with specific fields.\n"
        "Year, type, region, customer, product should be selected according to the user query.\n"
        "DO NOT make up any information, if one of the fields is not provided, set it as None.\n"
        "Always return a python list."
    )
        
    def create_agent(self):
        self.tools = []
        self.search_agent = create_react_agent(
            model=self.model,
            tools=self.tools,
            prompt=self.SYSTEM_INSTRUCTION,
            response_format=(self.FORMAT_INSTRUCTION,Search_Query)
        )

    def build_dictionary(self,query):
        response = self.search_agent.invoke({"messages": [{"role": "user", "content": query}]})
        ans = response['structured_response'].search_dict[-1]
        s = str(ans)
        values = re.findall(r"(?:\w+)=('.*?'|\S+)", s)
        values = [v.strip("'") for v in values]
        logger.debug(values)
        return values

async def main_loop():
    agent = SearchAgent()
    query = "Give me loss documents in California"
    response = agent.build_dictionary(query)
    print("======== model response:")
    print(response)
    print(type(response))
    return

if __name__ == '__main__':
    import asyncio
    asyncio.run(main_loop())