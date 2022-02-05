from flask import Flask, request
from repo import Repo

app = Flask(__name__)

@app.route('/', methods=["POST"])
def rank():
    data = request.get_json()
    name = data.get('name', None)
    path = data.get('path', None)
    url = data.get('url', None)
    repo = Repo(name, url, path)
    rank = repo.rank()
    # on update (if clone)
    path = repo.path
    return {"rank": rank, "path": path}

