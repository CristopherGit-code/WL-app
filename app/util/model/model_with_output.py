from app.util.model.oci_openai_client import LLM_Open_Client
import logging

logger = logging.getLogger(name=f"{__name__}")

class Model_With_Output:
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Model_With_Output,cls).__new__(cls)
            cls._instance._init()
        return cls._instance
    
    def _init(self):
        if self._initialized:
            return
        self.openai_module = LLM_Open_Client()
        self._initialized = True

    def bind_output(self,schema):
        model = self.openai_module.build_llm_client()
        output_model = model.with_structured_output(schema)
        return output_model