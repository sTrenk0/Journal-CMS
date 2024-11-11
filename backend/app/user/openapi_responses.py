from fastapi import status

from app.openapi_type import OpenAPIResponseType
from app.schemas_utils import ErrorModel

from .errors import UserError

USER_WITH_THIS_EMAIL_ALREADY_EXISTS_RESPONSE: OpenAPIResponseType = {
    status.HTTP_400_BAD_REQUEST: {
        "description": "User with this email already exists.",
        "model": ErrorModel,
        "content": {
            "application/json": {"example": {"detail": UserError.EMAIL_ALREADY_EXISTS}}
        },
    }
}

USER_NOT_FOUND_RESPONSE: OpenAPIResponseType = {
    status.HTTP_404_NOT_FOUND: {
        "description": "User not found.",
        "model": ErrorModel,
        "content": {"application/json": {"example": {"detail": UserError.NOT_FOUND}}},
    }
}


USER_ALREADY_EXISTS_RESPONSE: OpenAPIResponseType = {
    status.HTTP_400_BAD_REQUEST: {
        "description": "User with this email already exists.",
        "model": ErrorModel,
        "content": {
            "application/json": {
                "example": {
                    "detail": UserError.ALREADY_EXISTS,
                }
            }
        },
    }
}
