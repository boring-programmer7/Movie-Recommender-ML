from flask import Flask, render_template
import numpy as np
import os
import pandas as pd
import heapq
from flask import jsonify
import string
from fuzzywuzzy import process
from sklearn.metrics.pairwise import cosine_similarity
import re
import requests
from flask_cors import CORS

# IMDB API KEY


# Alphabet
alphabet = list(string.ascii_lowercase)
alphabet.extend(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])


class MovieNotFound(Exception):
    """Base class for exceptions in this module."""

    pass


# Load Data and Model

# load dict of arrays
dict_data = np.load("data/cosineSim.npz")
# extract the first array
cs = dict_data["arr_0"]
print(cs)
df = pd.read_csv("data/data.csv")
columns = df.columns


# API movieDateBase IMDB


def getAPIinfo(movie_id):

    api_key = os.environ["IMDB_API_KEY"]
    BASE_URL = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}"

    r = requests.get(BASE_URL)
    if r.status_code == 200:
        data = r.json()
        poster = data["poster_path"]
        IMAGE_URL = f"https://image.tmdb.org/t/p/original{poster}"
        return IMAGE_URL
    else:
        return None


# Get Recommendations by name


def getRecommendations(title, n=6):

    if title in df["title"].unique():
        _id = df[df["title"] == title].index
        a = cs[_id][0]
        recommendations = heapq.nlargest(n, range(len(a)), a.take)
        x = df.loc[recommendations][columns]
        x["Percentage"] = a[recommendations]
        res = x
        res["posterUrl"] = res["imdb_id"].apply(lambda x: getAPIinfo(x))
        return res
    else:
        raise MovieNotFound


# get Similar Names

# Función de normalizar textos
def NormText(
    text,
    myreplace={
        "á": "a",
        "é": "e",
        "í": "i",
        "ó": "o",
        "ú": "u",
    },
):
    _str = "".join(re.findall(r"[\w&\s]", text)).lower().strip()
    _str = re.sub("\s{2,}", " ", _str)
    for key, replace in myreplace.items():
        _str = _str.replace(key, replace)
    _str = re.sub("\s{2,}", " ", _str)
    return _str.strip()


# Doc->Array using alphabet
def arr2doc(doc):
    arr = []
    for letter in alphabet:
        arr.append(doc.count(letter))
    return arr


def makeArray(documents):
    return list(map(arr2doc, documents))


def getSimilarNames(input_user, n=10, score=90):
    title = [input_user]
    documents = df["title"]
    new = list(map(NormText, documents))
    new2 = list(map(NormText, title))
    Arr = makeArray(new)
    Arr2 = makeArray(new2)
    # Cosine Similarity Names
    csNames = cosine_similarity(Arr2, Arr)
    a = csNames[0]
    recommendations = heapq.nlargest(n, range(len(a)), a.take)
    _idx = df["title"][recommendations].index
    results = df.loc[_idx][columns]
    options = results["title"].map(NormText)
    fuzz = process.extractBests(NormText(input_user), options, score_cutoff=score)
    if fuzz != []:
        return df.loc[[f[2] for f in fuzz]][columns]
    else:
        raise MovieNotFound


# Init Flask app
app = Flask(__name__, static_folder="build/static", template_folder="build")
CORS(app)


# Routes

# Hello
@app.route("/")
def home():
    return render_template("index.html")


# Recommendations
@app.route("/r/<name>")
def recommender(name):
    try:
        res = getRecommendations(name)
        data = res.to_dict("records")
        print(data)
        return jsonify(data)
    except MovieNotFound:
        return jsonify([])


# Similar Names to User Input


@app.route("/s/<name>")
def similarnames(name):
    try:
        res = getSimilarNames(name)
        data = res.to_dict("records")
        print(data)
        return jsonify(data)
    except MovieNotFound:
        return jsonify([])


if __name__ == "__main__":
    app.run(debug=False)