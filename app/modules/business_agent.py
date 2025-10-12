from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from app.util.model.oci_openai_client import LLM_Open_Client
import logging

logger = logging.getLogger(name=f'{__name__}')

class BusinessAgent:
    """ Business agent in charge of scraping the documents """

    _instance = None
    _initialized = False

    SYSTEM_INSTRUCTION = (
        """
        You are a professional business, economics, and deal analysis expert.
        Your primary goal is to integrate and synthesize information exclusively from the documents and context provided by the user.
        Always perform comprehensive analysis across all relevant documents to help the user gain deep insight into the content.
        When responding, directly address every part of the user's query, ensuring your explanation is thorough, accurate, and grounded solely in the supplied documentation.
        If the user's question is general in scope, draw from and integrate all documents provided. If the user requests information about a specific document or data point, locate and use only the relevant file(s) and information required. Follow user instructions closely.
        Never generate or infer information that is not explicitly present in the documents or context provided. All parts of your response must be supported by the content in the supplied files.
        Focus on clarity and accuracy in your analysis, explaining your reasoning and referencing supporting information from the documents as appropriate.
        Maintain a professional tone at all times. If asked an unprofessional or inappropriate question, politely decline to respond and gently redirect the user to focus on document-based business or economic queries.
        """
    )

    ANALYSIS_PROMPT = """You are a professional business analyst.
    You will be given a compilitation of different documents after a user question.
    Your job is to provide a full analysis based in the information given for the question the user is providing:"""

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(BusinessAgent,cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self.oci_client = LLM_Open_Client()
            self.model = self.oci_client.build_llm_client()
            self.tools = []
            self._memory = MemorySaver()
            self.business_agent = create_react_agent(
                model=self.model,
                tools=self.tools,
                checkpointer=self._memory,
                prompt=self.SYSTEM_INSTRUCTION
            )

            BusinessAgent._initialized = True

    def _call_agent(self,u_prompt, user_id, u_instructions:str):
        try:
            generated_response = self.business_agent.invoke(
                    {"messages": [{"role":"system", "content": u_instructions},{"role": "user", "content": u_prompt}]},
                    {'configurable': {'thread_id': user_id}}
                )
            response = generated_response['messages'][-1].content
        except Exception as e:
            logger.debug(e)
            response = f"Error from agent: {e}.\nTry refreshing the page or loading again the documents."

        return response
    
    def provide_analysis(self, query:str, u_instructions:str, user_id:str) -> str:
        prompt = self.ANALYSIS_PROMPT + query
        response = self._call_agent(prompt,user_id, u_instructions)
        return response

def main():
    llm = BusinessAgent()
    while True:
        prompt = input('User: ')
        ans = llm._call_agent(prompt,"123","")
        print(ans)
    
if __name__ == "__main__":
    main()