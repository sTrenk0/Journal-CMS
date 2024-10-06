from typing import Any, Dict
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import logging
from jinja2 import Template
from pathlib import Path
from .settings import config



SMPTP_HOST = "smtp.gmail.com"
SMPTP_PORT = 465
SMTPT_CLIENT_URL = f"{SMPTP_HOST}:{SMPTP_PORT}"
SENDER_EMAIL = config.app_sender_email
CLIENT_PASSWORD = config.app_client_password
TEMPLATES_DIR: Path = Path(__file__).parent.parent / "email-templates"


def send_email(
        msg: MIMEMultipart | str,
        email_to: str,
        smtpt_client_url: str = SMTPT_CLIENT_URL,
        sender_email: str = SENDER_EMAIL,
        client_password: str = CLIENT_PASSWORD,
) -> None:
    try:
        with smtplib.SMTP_SSL(smtpt_client_url) as server:
            server.login(sender_email, client_password)
            server.sendmail(sender_email, email_to, msg.as_string())
            logging.info(f"Email successfully sent to {email_to}")
    except smtplib.SMTPException as e:
        logging.error(f"Failed to send email to {email_to}: {e}", exc_info=True)


def render_template(template_name: str, context: Dict[str, Any]) -> str:
    template_path = TEMPLATES_DIR / template_name
    html_content = Template(template_path.read_text()).render(context)
    return html_content


def generate_verify_by_code_email(
        email_to: str,
        code: int,
        sender_email: str = SENDER_EMAIL,
) -> MIMEMultipart:
    context = {
        "service_name": "Forbes",  # TODO:
        "email": email_to,
        "code": code,
    }
    html_content = render_template("verify_code.html", context)
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = email_to
    html_part = MIMEText(html_content, "html")
    msg.attach(html_part)
    return msg


def generate_product_email(
        email_to: str,
        sender_email: str = SENDER_EMAIL,
) -> MIMEMultipart:
    pass
