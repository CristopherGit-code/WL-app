from util.config.config import Settings
from util.file_handler import File_handlder
from modules.business_agent import BusinessAgent
from modules.search_agent import SearchAgent
from db.db import DataBase
import gradio as gr
import logging
import uuid
import os

logger = logging.getLogger(name=f'{__name__}')

class UI:
    def __init__(self):
        self.merged_data = ''
        self.merged_files_db = {}
        self.settings_path = os.environ.get("SETTINGS_PATH")
        self.settings = Settings(self.settings_path)
        self.db = DataBase(self.settings)
        self.business_agent = BusinessAgent()
        self.openai_client = SearchAgent()
        self.file_manager = File_handlder()

    def load_user_session(self,session):
        user_id = uuid.uuid4()
        session = user_id    
        return session
    
    def _get_user_filter_files(self,user_id):
        try:
            return self.merged_files_db[user_id]
        except KeyError as k:
            return ''

    def _manage_user_filter_files(self,user_id,content):
        user_files = self._get_user_filter_files(user_id)
        if not user_files:
            self.merged_files_db[user_id] = ''
        self.merged_files_db[user_id] = content

    def _build_preview(self,titles,content,show_content:int):
        preview_list = []
        for file_name,file_content in zip(titles,content):
            preview_list.append((file_name,file_content))

        return preview_list
    
    def _manage_filter(self,year,endYear,type,region,customer,product, user_id, show_content:float):
        responses = self.db.get_db_response(['t.metadata.file_name','t.content'],year,endYear,type,region,customer,product)
        if not responses:
            self.merged_data = 'No data, retry'
            return ['No files found with that filter']
        else:
            self.merged_data = self.file_manager.merge_md(responses[1])
            self._manage_user_filter_files(user_id, self.merged_data)
            preview_list = self._build_preview(responses[0],responses[1], int(show_content))
            return preview_list
        
    def get_client_analysis(self,prompt,message_history,system_instructions, user_id):
        query = prompt + f' given the data in {self._get_user_filter_files(user_id)}'
        
        response = self.business_agent.provide_analysis(query,system_instructions,user_id)
        return response
    
    def get_client_manual_filter(self,year,endYear,type,region,customer,product, prompt:str, user_id, show_content):
        if year == "All" or year == '':
            year = None
        else:
            year = int(year)

        if endYear == "All" or endYear == '':
            endYear = None
        else:
            endYear = int(endYear)

        preview_list = self._manage_filter(year,endYear,type,region,customer,product, user_id, show_content)
        
        return preview_list

    def get_client_filter(self,year,type,region,customer,product, prompt:str, user_id, show_content):        
        r_dict =self.openai_client.build_dictionary(prompt)
        year_p = r_dict[0]
        endYear_p = r_dict[5]
        if year_p == "All":
            year_p = None
        else:
            year_p = int(year_p)
        if endYear_p == "All":
            endYear_p = None
        else:
            endYear_p = int(endYear_p)
        type_p = r_dict[1]
        region_p = r_dict[2]
        region_p = region_p.upper()

        customer_p = r_dict[3]
        product_p = r_dict[4]
        preview_list = self._manage_filter(year_p,endYear_p,type_p,region_p,customer_p,product_p, user_id, show_content)
        
        return preview_list
    
    def available_filters(self):
        responses = self.db.get_db_response(
            ['t.metadata.report_date','t.metadata.type','t.metadata.regions[0].region','t.metadata.customer']
        )
        years = [str(date[:4]) for date in responses[0]]
        unique_years = sorted(set(years))
        unique_years.insert(0,"All")

        responses[1].insert(0,"")
        unique_type = sorted(set(responses[1]))

        responses[2].insert(0,"")
        unique_region = sorted(set(responses[2]))

        responses[3].insert(0,"")
        unique_customer = sorted(set(responses[3]))

        return unique_years,unique_type,unique_region,unique_customer
    
    def manage_files(self,new_files):
        return 'Pass'
    
    def hide_welcome(self):
        return gr.update(visible=False),gr.update(visible=False),gr.update(visible=True)
    
    def get_chat_placeholder(self):
        return self.settings.chat_placeholder
    
    def get_welcome_placeholder(self):
        return self.settings.welcome_instructions