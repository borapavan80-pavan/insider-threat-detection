import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

load_dotenv(BASE_DIR / ".env")

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

SENDER_EMAIL = os.getenv("EMAIL_ADDRESS")
SENDER_PASSWORD = os.getenv("EMAIL_APP_PASSWORD")


def send_otp_email(receiver_email, otp):

    message = EmailMessage()

    message["Subject"] = "Your Security System OTP"
    message["From"] = SENDER_EMAIL
    message["To"] = receiver_email

    message.set_content(
        f"""
Hello,

Your OTP for the Insider Threat Detection System is:

{otp}

This OTP is valid for 5 minutes.

If you did not request this OTP, please ignore this email.

Regards,
Insider Threat Detection System
"""
    )

    try:

        print("Sender:", SENDER_EMAIL)
        print("Password loaded:", bool(SENDER_PASSWORD))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:

            server.starttls()

            server.login(
                SENDER_EMAIL,
                SENDER_PASSWORD
            )

            server.send_message(message)

        print("OTP email sent successfully")

        return True

    except Exception as error:

        print("Email sending failed:", error)

        return False