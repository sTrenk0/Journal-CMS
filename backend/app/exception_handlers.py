from fastapi.responses import JSONResponse


async def http_exception_internal_handler(request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."},
    )
