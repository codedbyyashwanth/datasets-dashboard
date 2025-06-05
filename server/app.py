from flask import Flask

# Create Flask application instance
app = Flask(__name__)

# Define a route
@app.route('/')
def hello_world():
    return '<h1>Hello, World!</h1>'

@app.route('/about')
def about():
    return '<h1>About Page</h1><p>This is a simple Flask application.</p>'

# Run the application
if __name__ == '__main__':
    app.run(debug=True)