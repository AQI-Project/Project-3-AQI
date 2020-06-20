from flask import Flask, render_template, redirect, jsonify, send_from_directory
from flask_pymongo import PyMongo
import scrape_weather

# Create an instance of Flask
app = Flask(__name__, static_url_path="") #can be used to specify a different path for the static files on the web. Defaults to the name of the static_folder folder.

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/weather_app")


# Route to render index.html template using data from Mongo
@app.route("/livedata")
def livedata():

    # Find one record of data from the mongo database
    xxx_data = mongo.db.weather.find_one()  
    # Return template and data
    return render_template("livedata.html", weather=xxx_data) # 

@app.route("/")
def home():
    return render_template("alldata.html")
                                      
@app.route("/getmygraph/<path:path>")
def send_bar(path):
    print(path)
    return send_from_directory('templates/', path) 

@app.route("/getmygraph2/<path:path>")
def send_bar2(path):
    print(path)
    return send_from_directory('templates/', path)

@app.route("/getmyfiles/<path:path>")
def send_js(path):
    print(path)
    return send_from_directory('templates/static/js/', path)



# Route that will trigger the scrape function
@app.route("/scrape")
def scrape():


    # Run the scrape function  the function in scrape_mars
    weather_data = scrape_weather.scrape()

    # Update the Mongo database using update and upsert=True  weather is the collection
    mongo.db.weather.update({}, weather_data, upsert=True)

    # Redirect back to home page
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True, port = 5000)
