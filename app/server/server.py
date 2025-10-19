import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from modules.UI_manager import UI

logging.basicConfig( level=logging.DEBUG, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s" )
logger = logging.getLogger(__name__)

app = FastAPI(title="WL APP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UI_manager = UI()

@app.get("/available_filters")
def get_available_user_filters():
    unique_years,unique_type,unique_region,unique_customer = UI_manager.available_filters()

    return {
        "uniqueYears": unique_years,
        "uniqueType": unique_type,
        "uniqueRegion": unique_region,
        "uniqueCustomer": unique_customer
    }

@app.post("/get_client_filters")
async def get_client_ai_query_filters(request: Request):
    data = await request.json()
    user_prompt = data.get("prompt","").strip()
    user_id = data.get("userID","")
    preview_list = UI_manager.get_client_filter(2010,"loss","US","E","ex",user_prompt,user_id,5)

    return {
        "previewList": preview_list
    }

@app.post("/get_client_manual_filters")
async def get_client_manual_filters(request: Request):
    data = await request.json()

    year = data.get("year","").strip()
    type = data.get("type","").strip()
    region = data.get("region","").strip()
    customer = data.get("customer","").strip()
    product = data.get("product","").strip()
    user_id = data.get("userID","")

    preview_list = UI_manager.get_client_manual_filter(year,type,region,customer,product,"E",user_id,5)

    return {
        "previewList": preview_list
    }

@app.post("/get_client_analysis")
async def get_client_analysis(request:Request):
    data = await request.json()

    prompt = data.get("prompt","").strip()
    sys_instructions = data.get("sys_instructions","").strip()
    user_id = data.get("userID","").strip()

    response = UI_manager.get_client_analysis(prompt,"",sys_instructions,user_id)

    return {"response":response}

@app.get("/user_session")
def get_user_session():
    session = UI_manager.load_user_session("")
    
    userID = str(session)

    return {"session":userID}

# uvicorn server.server:app --reload --host 0.0.0.0 --port 8000