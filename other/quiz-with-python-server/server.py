from flask import Flask, render_template, request

app = Flask(__name__)

answers = ["B", "C"]

didAnswer = [False, False]


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/q1")
def q1():
    return render_template("q1.html")


@app.post("/q1_ans")
def q1_ans():
    if didAnswer[0]:
        return "You have already answered this question"
    didAnswer[0] = True
    answer = request.get_json()["answer"]
    if answer == answers[0]:
        return "correct"
    return "incorrect"


@app.route("/q2")
def q2():
    return render_template("q2.html")


@app.post("/q2_ans")
def q2_ans():
    if didAnswer[1]:
        return "You have already answered this question"
    didAnswer[1] = True
    answer = request.get_json()["answer"]
    if answer == answers[1]:
        return "correct"
    return "incorrect"


@app.route("/result")
def result():
    return render_template("result.html")


if __name__ == "__main__":
    app.run(port=8000)
