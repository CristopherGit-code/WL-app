import gradio as gr

with gr.Blocks() as wl_app:
    gr.Markdown("""<h1 align="center"> Win / Loss call analysis TEST</h1>""")
    
# wl_app.queue(max_size=60).launch(max_threads=6, root_path="/wl_app", server_port=5002,show_api=False)
wl_app.queue(max_size=60).launch(root_path='/wl_app', server_port=5002)

""" location /cris/ {
               proxy_pass              http://localhost:3002/;
 }

# app ports 500x
 location /ux_app/ {
               proxy_pass              http://localhost:5001/;
 }
 location /wl_app/ {
               proxy_pass              http://localhost:5002/; 
(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-phoenix-1.oraclecloud.com))(connect_data=(service_name=g81a4d6b2b75f73_innovationlab_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))
               """