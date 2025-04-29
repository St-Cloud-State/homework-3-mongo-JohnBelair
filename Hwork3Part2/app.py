from appNumberGen import generate_application_number
from flask import Flask, jsonify, render_template, request
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient('mongodb://localhost:27017/')
db = client['loan_applications']
applications_collection = db['applications']

@app.route('/api/add_application', methods=['POST'])
def add_application():
    print("adding application")
    application_number = generate_application_number()
    data = request.get_json()
    name = data.get('name')
    zipcode = data.get('zipcode')
    status = 'received'
    sub_status =  ''
    processing_message = ''
    notes = ''

    application = {
        '_id': application_number,
        'name': name,
        'zipcode': zipcode,
        'status': status,
        'sub-status': sub_status,
        'processing message': processing_message,
        'notes': notes,
    }

    applications_collection.insert_one(application)

    response_data = application.copy()
    response_data['application_number'] = response_data.pop('_id')

    return jsonify({
        'message': 'Application submitted successfully',
        'application': response_data
    })

@app.route('/api/get_application_status', methods=['GET'])
def get_application_status():
    print("finding application status")
    application_number = request.args.get('application_number')
    application = applications_collection.find_one({'_id': application_number})

    if application:
        application['application_number'] = application.pop('_id')
        return jsonify({
            'message': 'Application found successfully',
            'application': application
        })
    else:
        return jsonify({
            'message': 'Application not found',
            'application': None
        })

@app.route('/api/process_application', methods=['POST'])
def process_application():
    print("processing application")
    data = request.get_json()
    application_number = data.get('application_number')
    new_status = 'processing'
    new_sub_status = data.get('sub_status')
    processing_message = data.get('processing_message')

    result = applications_collection.update_one(
    {'_id': application_number},
    {'$set': {
        'status': new_status,
        'sub-status': new_sub_status,
        'processing message': processing_message
    }})

    if result.matched_count > 0:
        updated_app = applications_collection.find_one({'_id': application_number})
        updated_app['application_number'] = updated_app.pop('_id')
        return jsonify({
            'message': 'Application status updated successfully',
            'application': updated_app
        })
    else:
        return jsonify({
            'message': 'Application not found',
            'application': None
        })

@app.route('/api/accept_application', methods=['POST'])
def accept_application():
    print("accepting application")
    data = request.get_json()
    application_number = data.get('application_number')
    new_status = 'accepted'
    new_sub_status = ''
    processing_message = ''
    new_notes = data.get('notes')

    result = applications_collection.update_one(
    {'_id': application_number},
    {'$set': {
        'status': new_status,
        'sub-status': new_sub_status,
        'processing message': processing_message,
        'notes': new_notes
    }})

    if result.matched_count > 0:
        updated_app = applications_collection.find_one({'_id': application_number})
        updated_app['application_number'] = updated_app.pop('_id')
        return jsonify({
            'message': 'Application status updated successfully',
            'application': updated_app
        })
    else:
        return jsonify({
            'message': 'Application not found',
            'application': None
        })

@app.route('/api/reject_application', methods=['POST'])
def reject_application():
    print("rejected application")
    data = request.get_json()
    application_number = data.get('application_number')
    new_status = 'rejected'
    new_sub_status = ''
    processing_message = ''
    new_notes = data.get('notes')

    result = applications_collection.update_one(
    {'_id': application_number},
    {'$set': {
        'status': new_status,
        'sub-status': new_sub_status,
        'processing message': processing_message,
        'notes': new_notes
    }})


    if result.matched_count > 0:
        updated_app = applications_collection.find_one({'_id': application_number})
        updated_app['application_number'] = updated_app.pop('_id')
        return jsonify({
            'message': 'Application status updated successfully',
            'application': updated_app
        })
    else:
        return jsonify({
            'message': 'Application not found',
            'application': None
        })


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)


