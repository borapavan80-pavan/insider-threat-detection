import secrets
from datetime import datetime, timedelta


# Temporary OTP storage
otp_store = {}


def generate_otp(email):
    # Generate a random 6-digit OTP
    otp = f"{secrets.randbelow(1000000):06d}"

    # OTP valid for 5 minutes
    expiry = datetime.now() + timedelta(minutes=5)

    # Store OTP for this particular email
    otp_store[email] = {
        "otp": otp,
        "expiry": expiry,
        "attempts": 0
    }

    return otp


def verify_otp(email, entered_otp):
    # Check whether this email has an OTP
    if email not in otp_store:
        return False, "OTP not found. Please request a new OTP."

    data = otp_store[email]

    # Maximum 5 attempts
    if data["attempts"] >= 5:
        del otp_store[email]
        return False, "Too many attempts. Please request a new OTP."

    # Count attempt
    data["attempts"] += 1

    # Check expiry
    if datetime.now() > data["expiry"]:
        del otp_store[email]
        return False, "OTP expired. Please request a new OTP."

    # Check OTP
    if entered_otp != data["otp"]:
        return False, "Invalid OTP."

    # Correct OTP
    del otp_store[email]

    return True, "OTP verified successfully."