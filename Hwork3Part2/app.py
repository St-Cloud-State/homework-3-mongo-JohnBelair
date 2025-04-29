from appNumberGen import generate_application_number
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)
applications = [];

def find_application(application_number):
    for application in applications:
        if application['application_number'] == application_number:
            return application
    return None

@app.route('/api/add_application', methods=['POST'])
def add_application():
    print("adding application")
    data = request.get_json()
    name = data.get('name')
    zipcode = data.get('zipcode')
    status = 'received'

    application_number = generate_application_number()

    applications.append({
        'name': name,
        'zipcode': zipcode,
        'status': status,
        'application_number': application_number
    })
    
    return jsonify({
        'message': 'Application submitted successfully',
        'application': applications[-1]
    })

@app.route('/api/get_application_status', methods=['GET'])
def get_application_status():
    print("finding application status")

    application_number = request.args.get('application_number')

    matching_application = find_application(application_number)
    
    if matching_application:
        return jsonify({
            'message': 'Application found successfully',
            'application': matching_application
        })
    else:
        return jsonify({
            'message': 'Application not found',
            'application': None
        })

@app.route('/api/set_application_status', methods=['POST'])
def set_application_status():
    print("setting application status")
    data = request.get_json()

    application_number = data.get('application_number')
    new_status = data.get('status')

    matching_application = find_application(application_number)
    
    if matching_application:
        matching_application['status'] = new_status
        
        return jsonify({
            'message': 'Application status updated successfully',
            'application': matching_application
        })

    else:
        return jsonify({
            'message': 'Application not found',
            'application': None
        })
 
# Route to render the index.html page
@app.route('/')
def index():
    return render_template('index.html')
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

