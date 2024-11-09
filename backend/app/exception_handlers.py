from datetime import datetime
from fastapi.responses import JSONResponse

from .email_utils import InternalErrorEmailTemplate
from .settings import config
import traceback
import pytz


async def http_exception_internal_handler(request, exc: Exception):
    # if config.app_is_notifiable_internal_exception:
    #     d = datetime.now(pytz.timezone(config.app_internal_exception_timezone_view))
    #     # TODO: Longing
    #     email = InternalErrorEmailTemplate(
    #         email_to=config.app_initial_superuser_email,
    #         traceback_log=traceback.format_exc(),
    #         dt_isoformat=d.isoformat(),
    #     )
    #     email.send()
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."},
    )
