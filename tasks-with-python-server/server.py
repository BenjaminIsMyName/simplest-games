from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS extension

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

users = []

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if "username" not in data or "password" not in data:
        return jsonify({"message": "Username and password are required"}), 400

    username = data["username"]
    password = data["password"]

    print("Username: " + username)
    print("Password: " + password)

    exist = False
    for user in users:
        if user["username"] == username:
            exist = True
            break

    if exist:
        return jsonify({"message": "Username already exists"}), 400

    else:
        users.append({"username": username, "password": password, "tasks": [], "failed": 0})
        return jsonify({"message": "Signup successful"}), 200
    


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if "username" not in data or "password" not in data:
        return jsonify({"message": "Username and password are required"}), 400

    username = data["username"]
    password = data["password"]

    print("Username: " + username)
    print("Password: " + password)

    for user in users:
        if user["username"] == username:
            if user["failed"] > 2:
                return jsonify({"message": "Your account is locked, too many attempts!"}), 400 


    for user in users:
        if user["username"] == username and user["password"] == password:
            user["failed"] = 0
            return jsonify({"message": "Login successful", "tasks": user["tasks"]}), 200

    user["failed"] += 1       
    return jsonify({"message": "Username or password is incorrect"}), 400


@app.route('/addtask', methods=['POST'])
def addtask():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    task = data["task"]
    for user in users:
        if user["username"] == username and user["password"] == password:
            user["tasks"].append(task)
            return jsonify({"message": "Wonderful", "tasks": user["tasks"]}), 200


# TODO: Delete endpoint




# Edit endpoint
@app.route('/edittask', methods=['POST'])
def edittask():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    task = data["task"]
    index = data["index"]
    for user in users:
        if user["username"] == username and user["password"] == password:
            user["tasks"][int(index)] = task
            return jsonify({"message": "Wonderful", "tasks": user["tasks"]}), 200



        
    
    


if __name__ == '__main__':
    app.run(debug=True)
