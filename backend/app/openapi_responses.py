from fastapi import status

from app.errors import ErrorModel, ErrorCode
from typing import Any, Dict, Union

OpenAPIResponseType = Dict[Union[int, str], Dict[str, Any]]

LOGIN_BAD_CREDENTIAL_RESPONSE: OpenAPIResponseType = {
    status.HTTP_400_BAD_REQUEST: {
        "description": "Bad credentials or the user is inactive.",
        "model": ErrorModel,
        "content": {
            "application/json": {
                "example": {
                    "detail": ErrorCode.LOGIN_BAD_CREDENTIALS,
                }
            }
        }
    }
}

UNAUTHORIZED_RESPONSE: OpenAPIResponseType = {
    status.HTTP_401_UNAUTHORIZED: {
        "description": "The user is not logged in.",
        "model": ErrorModel,
        "content": {
            "application/json": {
                "example": {
                    "detail": ErrorCode.UNAUTHORIZED,
                }
            }
        }
    }
}

REGISTER_USER_ALREADY_EXISTS_RESPONSE: OpenAPIResponseType = {
    status.HTTP_400_BAD_REQUEST: {
        "description": "User with this email already exists.",
        "model": ErrorModel,
        "content": {
            "application/json": {
                "example": {
                    "detail": ErrorCode.REGISTER_USER_ALREADY_EXISTS,
                }
            }
        }
    }
}

FORBIDDEN_RESPONSE: OpenAPIResponseType = {
    status.HTTP_403_FORBIDDEN: {
        "description": "Does not have permission to perform requested action.",
        "model": ErrorModel,
        "content": {
            "application/json": {
                "example": {
                    "detail": ErrorCode.FORBIDDEN,
                }
            }
        }
    }
}

USER_NOT_FOUND_RESPONSE: OpenAPIResponseType = {
    status.HTTP_404_NOT_FOUND: {
        "description": "User not found.",
        "model": ErrorModel,
        "content": {
            "application/json": {
                "example": {
                    "detail": ErrorCode.USER_NOT_FOUND
                }
            }
        }
    }
}

NOT_VERIFY_EMAIl_RESPONSE: OpenAPIResponseType = {
    status.HTTP_404_NOT_FOUND: {
        "description": "User not verify email",
        "model": ErrorModel,
        "content": {
            "application/json": {
                "example": {
                    "detail": ErrorCode.NOT_VERIFY_EMAIl
                }
            }
        }
    }
}
