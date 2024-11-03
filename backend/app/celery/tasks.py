from email.mime.multipart import MIMEMultipart
from celery import shared_task

from app.email_utils import send_email


@shared_task
async def send_email_task(
        msg: MIMEMultipart,
        email_to: str,
):
    send_email(
        msg=msg,
        email_to=email_to
    )


@shared_task
async def check(var):
    print("var")
