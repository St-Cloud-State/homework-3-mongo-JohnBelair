const applications = [];

function processApplication() {
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
                document.getElementById('statusText').innerHTML = `
                    <h3>Application Found Successfully!</h3>
                    <p>Your application status is: ${application.status}</p>`;
            } else {
                document.getElementById('statusText').innerHTML = `
                    <h3>Application Not Found</h3>`;
            }
        })

        .catch(error => {
            console.error('Error finding applicant:', error);
        });
}

function changeApplicationStatus() {
    const applicationNumber = document.getElementById('applicationNumber').value;
    const applicationStatus = document.getElementById('applicationStatus').value;

    const applicationData = {
        application_number: applicationNumber,
        status: applicationStatus
    };

    const validStatuses = ['not found', 'received', 'processing', 'accepted', 'rejected'];

    if (!validStatuses.includes(applicationStatus)) {
        alert('Invalid Status! Allowed statuses are: not found, received, processing, accepted, rejected.');
        return;
    }

    fetch('/api/set_application_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.application) {
            document.getElementById('updateText').innerHTML = `
                <h3>Application Status Updated Successfully!</h3>
                <p>New status: ${data.application.status}</p>`;
        } else {
            document.getElementById('updateText').innerHTML = `
                <h3>Application Status Not Valid</h3>`;
        }
    })

    .catch(error => {
        console.error('Error updating application status:', error);
    });

}