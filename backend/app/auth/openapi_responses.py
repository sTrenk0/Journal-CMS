from fastapi import status
from app.openapi_type import OpenAPIResponseType
from .errors import AuthError
from app.schemas_utils import ErrorModel

LOGIN_BAD_CREDENTIAL_RESPONSE: OpenAPIResponseType = {
    status.HTTP_400_BAD_REQUEST: {
        "description": "Bad credentials or the user is inactive.",
        "model": ErrorModel,
        "content": {
            "application/json": {
                "example": {
                    "detail": AuthError.LOGIN_BAD_CREDENTIALS,
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
                    "detail": AuthError.UNAUTHORIZED,
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
                    "detail": AuthError.FORBIDDEN,
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
                    "detail": AuthError.NOT_VERIFY_EMAIl
                }
            }
        }
    }
}
