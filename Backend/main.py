from flask import Flask, request, jsonify
from flask_cors import CORS
from faker import Faker

app = Flask(__name__)
CORS(app)

fake = Faker('it_IT')

generi = [
    "Fantasy",
    "Distopia",
    "Romanzo",
    "Mistero",
    "Fantascienza",
    "Horror",
    "Avventura",
    "Storico",
    "Biografia",
    "Poesia"
]

def genera_libri():
    libri_generati = []
    
    for i in range(20):
        libro = {
            "id": i + 1,
            "titolo": fake.sentence(nb_words=4),
            "autore": fake.name(),
            "anno": fake.random_int(min=1900, max=2024),
            "genere": fake.random_element(generi)
        }
        libri_generati.append(libro)
    
    return libri_generati

libri = genera_libri()

prossimo_id = len(libri) + 1


@app.route("/api/libri", methods=["GET"])
def get_libri():
    return jsonify(libri)


@app.route("/api/libri", methods=["POST"])
def aggiungi_libro():
    dati = request.json
    
    if not dati or "titolo" not in dati or "autore" not in dati:
        return jsonify({"errore": "Titolo e autore sono obbligatori"}), 400
    
    global prossimo_id
    libro_nuovo = {
        "id": prossimo_id,
        "titolo": dati.get("titolo"),
        "autore": dati.get("autore"),
        "genere": dati.get("genere", ""),
        "anno": dati.get("anno", "")
    }
    
    libri.append(libro_nuovo)
    prossimo_id = prossimo_id + 1
    
    return jsonify(libro_nuovo), 201


@app.route("/api/libri/<int:id>", methods=["DELETE"])
def elimina_libro(id):
    global libri
    
    libro_trovato = False
    for i in range(len(libri)):
        if libri[i]["id"] == id:
            libro_trovato = True
            break
    
    if libro_trovato is False:
        return jsonify({"errore": "Libro non trovato"}), 404
    
    libri[:] = [libro for libro in libri if libro["id"] != id]
    
    return jsonify({"messaggio": "Libro eliminato"}), 200


@app.route("/api/libri", methods=["DELETE"])
def elimina_tutti_libri():
    global libri
    libri[:] = []
    return jsonify({"messaggio": "Tutti i libri sono stati eliminati"}), 200


@app.route("/api/libri/genera", methods=["POST"])
def genera_nuovi_libri():
    global prossimo_id
    libri_generati = []
    
    for i in range(10):
        libro = {
            "id": prossimo_id,
            "titolo": fake.sentence(nb_words=4),
            "autore": fake.name(),
            "anno": fake.random_int(min=1900, max=2024),
            "genere": fake.random_element(generi)
        }
        libri.append(libro)
        libri_generati.append(libro)
        prossimo_id += 1
    
    return jsonify(libri_generati), 201


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)



