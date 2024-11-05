from fastapi.responses import JSONResponse
from .settings import config
from .email_utils import generate_internal_error_email_template, send_email


async def http_exception_internal_handler(request, exc: Exception):
    if config.is_notifiable_internal_exception:
        msg = generate_internal_error_email_template(
            email_to=config.app_initial_superuser_email,
            traceback_log=str(exc),
        )
        send_email(
            msg=msg,
            email_to=config.app_initial_superuser_email,
        )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."},
    )
