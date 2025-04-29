const applications = [];

function addApplication() {
    const applicantName = document.getElementById('applicantName').value;
    const applicantZipcode = document.getElementById('applicantZipcode').value;

    const applicationData = {
        name: applicantName,
        zipcode: applicantZipcode
    };

    fetch('/api/add_application', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
    })
        .then(response => response.json())
        .then(data => {
            const application = data.application;
            applications.push(application);
            console.log(applications);

            document.getElementById('conformationText').innerHTML = `
            <h3>Application Submitted Successfully!</h3>
            <p>Your application number is: ${application.application_number}</p>`;})

        .catch(error => {
            console.error('Error adding applicant:', error);
        });
}

function checkApplicationStatus() {
    const applicationNumber = document.getElementById('applicationNumber').value;

    fetch(`/api/get_application_status?application_number=${applicationNumber}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const application = data.application;

            if (application) {
                let statusText = `
                    <h3>Application Found Successfully!</h3>
                    <p>Your application status is: ${application.status}</p>`;
            
                if (application["sub-status"]) {
                    statusText += `<p>Sub-status: ${application["sub-status"]}</p>`;
                }
            
                if (application["processing message"]) {
                    statusText += `<p>Processing Message: ${application["processing message"]}</p>`;
                }

                if (application["notes"]) {
                    statusText += `<p>Notes: ${application["notes"]}</p>`;
                }
                
                document.getElementById('statusText').innerHTML = statusText;

            } else {
                document.getElementById('statusText').innerHTML = `
                    <h3>Application Not Found</h3>`;
            }
        })

        .catch(error => {
            console.error('Error finding applicant:', error);
        });
}

function processApplication() {
    const applicationNumber = document.getElementById('applicationNumber').value;
    const subStatus = document.getElementById('subStatus').value;
    const processingMessage = document.getElementById('processingMessage').value;

    const applicationData = {
        application_number: applicationNumber,
        sub_status : subStatus,
        processing_message : processingMessage
    };

    fetch('/api/process_application', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.application) {
            document.getElementById('processText').innerHTML = `
                <h3>Application Status Updated Successfully!</h3>`;
        } else {
            document.getElementById('processText').innerHTML = `
                <h3>Application Status Not Valid</h3>`;
        }
    })

    .catch(error => {
        console.error('Error updating application status:', error);
    });

}

function acceptApplication(){
    const applicationNumber = document.getElementById('applicationNumber').value;
    const notes = document.getElementById('acceptNotes').value;

    const applicationData = {
        application_number: applicationNumber,
        notes: notes

    };

    fetch('/api/accept_application', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.application) {
            document.getElementById('acceptText').innerHTML = `
                <h3>Application Status Updated Successfully!</h3>`;
        } else {
            document.getElementById('acceptText').innerHTML = `
                <h3>Application Status Not Valid</h3>`;
        }
    })

    .catch(error => {
        console.error('Error updating application status:', error);
    });
}

function rejectApplication(){
    const applicationNumber = document.getElementById('applicationNumber').value;
    const notes = document.getElementById('rejectNotes').value;

    const applicationData = {
        application_number: applicationNumber,
        notes: notes
    };

    fetch('/api/reject_application', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.application) {
            document.getElementById('rejectText').innerHTML = `
                <h3>Application Status Updated Successfully!</h3>`;
        } else {
            document.getElementById('rejectText').innerHTML = `
                <h3>Application Status Not Valid</h3>`;
        }
    })

    .catch(error => {
        console.error('Error updating application status:', error);
    });
}