from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai
from qdrant_client import QdrantClient
from typing import List
app = Flask(__name__)
CORS(app)

load_dotenv()

api = os.getenv('api')
genai.configure(api_key=api)

from datasets import load_dataset

ds = load_dataset("karan842/ipc-sections")
ds2= load_dataset("Sharathhebbar24/Indian-Constitution")
ds3= []
for row in ds["train"]:
    ds3.append((row['Description'] or " ")+" and the section is : " + (row['Section'] or "")+". And the offence is "+ (row['Offense'] or " " )  + " And the punishment is "+(row['Punishment'] or " ")
   )

ds4=[]
for row in ds2["train"]:
    ds4.append(row['article_desc'])

ds5=ds3+ds4

client = QdrantClient(":memory:") 
docs = ds5

client.add(
    collection_name="demo_collection",
    documents=docs,
    
)
search_result = client.query(
        collection_name="demo_collection",
        query_text="message"
    )

@app.route('/start', methods=['GET'])
def start():
    return jsonify({'response': 'Hello World!'})

@app.route('/pdfchat', methods=['POST'])
def pdfchat():
    data =request.get_json()
    question = data['question']
    context = data['context']
    print("question: ", question)
    print("context: ", context)
    client.add(
        collection_name="pdf",
        documents=context,
    )
    search_result = client.query(
        collection_name="pdf",
        query_text=question
    )
    sorted_results = sorted(search_result, key=lambda x: x.score, reverse=True)
    top_5_results = sorted_results[:5]
    
    new_context=""
    for result in top_5_results:
        new_context+=result.document+"\n"
    print("new_context: ", new_context)
    model= genai.GenerativeModel('gemini-1.5-flash')
    prompt = " I am calling this from back"
    chat= model.start_chat()
    msg= " I am calling this from backend just give answer as string. You are a lawyer from India. I am am asking a question regarding some legal document of mine. I am attaching top match sentences from that legal document with the query:  "+new_context+ ". Now, the question is : "+ question + " Now you can answer the question. "
    response = chat.send_message(msg)
    print("response: ", response.text)
    return jsonify({'response': response.text})

@app.route('/chat', methods=['POST'])   
def chat():
    data = request.get_json()
    message = data['message']
    previous= data['previous']
    print("message: ", message)
    print("previous: ", previous)
    
    history=[]
    for i in range(len(previous)):
        user=previous[i]['user']
        if(user=="Ai-Lawyer"):
            user="model"
        else:
            user="user"
        history.append({"role": user, "parts": previous[i]['text']})

    print("history: ", history)
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = " I am calling this from back"
    print("yaha tak 1")
    chat= model.start_chat(history=history)
    print("yaha tak 2")
    

    search_result = client.query(
        collection_name="demo_collection",
        query_text=message
    )
    
    print("yaha tak 3")

    
    class QueryResponse:
        def __init__(self, id, embedding, sparse_embedding, metadata, document, score):
            self.id = id
            self.embedding = embedding
            self.sparse_embedding = sparse_embedding
            self.metadata = metadata
            self.document = document
            self.score = score



    
    sorted_results = sorted(search_result, key=lambda x: x.score, reverse=True)

    print("yaha tak 4")
    top_5_results = sorted_results[:5]
    context=""
    retdata=[]
    
    for result in top_5_results:
        context+=result.document+"\n"
        retdata.append(result.document)
    print("yaha tak 5")
    print("context: ", context)
    msg=" I am calling this from backend just give answer as string. You are a lawyer from India. I am am asking this question from you. Question is : "+ message + " I am also attaching top close IPC sections or Constitution article to the query:  "+context+ " Now you can answer the question. "
    response = chat.send_message(msg)
    print("yaha tak 6")
    print("response ",response)
    print(response.text)

    
    

    return jsonify({'response': response.text, 'top_5_results': retdata})






if __name__ == '__main__':
    app.run(debug=True)