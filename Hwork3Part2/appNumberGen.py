import random

def generate_application_number():
    randomNumber = str(random.randint(1000000, 9999999))
    applicationNumber = 'A' + randomNumber
    return applicationNumber