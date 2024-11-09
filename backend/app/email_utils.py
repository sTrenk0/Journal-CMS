from typing import Dict, Any, Protocol
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import logging
from jinja2 import Template
from pathlib import Path
from .settings import config

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
SMTP_CLIENT_URL = f"{SMTP_HOST}:{SMTP_PORT}"
TEMPLATES_DIR: Path = Path(__file__).parent.parent / "email-templates"


class EmailMessage:
    def __init__(
        self, email_to: str, template_name: str, subject: str, context: dict[str, str]
    ):
        self.email_to = email_to
        self.subject = subject
        self.template_name = template_name
        self.context = context
        self._msg = self._generate_msg()

    def _render_template(self) -> str:
        template_path = TEMPLATES_DIR / self.template_name
        template = Template(template_path.read_text())
        return template.render(self.context)

    def _generate_msg(self) -> MIMEMultipart:
        msg = MIMEMultipart()
        msg["From"] = config.sender_email
        msg["To"] = self.email_to
        msg["Subject"] = self.subject
        msg.attach(MIMEText(self._render_template(), "html"))
        return msg

    def send(self) -> None:
        try:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
                server.login(config.sender_email, config.client_email_password)
                server.sendmail(
                    config.sender_email, self.email_to, self._msg.as_string()
                )
                logging.info(f"Email successfully sent to {self.email_to}")
        except smtplib.SMTPException as e:
            logging.exception(
                f"Failed to send email to {self.email_to}: {e}", exc_info=True
            )


class RecoveryPasswordEmailTemplate(EmailMessage):
    def __init__(self, email_to: str, recovery_code: int):
        super().__init__(
            email_to=email_to,
            subject=config.project_name + "(Recovery password)",
            template_name="recovery_password.html",
            context={
                "email_to": email_to,
                "recovery_code": recovery_code,
                "action_url": "https://www.journal.com",
            },
        )


class ProductEmailTemplate(EmailMessage):
    def __init__(self, email_to: str, source_product_url: str):
        super().__init__(
            email_to=email_to,
            subject=config.project_name + "(Product email)",
            template_name="product_email.html",
            context={"email_to": email_to, "source_product_url": source_product_url},
        )


class InternalErrorEmailTemplate(EmailMessage):
    def __init__(self, email_to: str, traceback_log: str, dt_isoformat: str):
        super().__init__(
            email_to=email_to,
            subject=config.project_name + "(Internal server error)",
            template_name="internal_error.html",
            context={
                "email_to": email_to,
                "traceback_log": traceback_log,
                "dt_isoformat": dt_isoformat,
            },
        )
