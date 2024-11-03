from fastapi import status
from app.openapi_type import OpenAPIResponseType
from app.schemas_utils import ErrorModel
from .errors import ProductError


PRODUCT_NOT_FOUND_RESPONSE: OpenAPIResponseType = {
    status.HTTP_404_NOT_FOUND: {
        "description": "Product not found.",
        "model": ErrorModel,
        "content": {
            "application/json": {
                "example": {
                    "detail": ProductError.NOT_FOUND
                }
            }
        }
    }
}

PRODUCT_WITH_NAME_OR_SOURCE_URL_ALREADY_EXISTS_RESPONSE: OpenAPIResponseType = {
    status.HTTP_404_NOT_FOUND: {
        "description": "Resource not found.",
        "model": ErrorModel,
        "content": {
            "application/json": {
                "examples": {
                    "Product with this name already exists.": {
                        "summary": "Product with this name already exists.",
                        "value": {
                            "detail": ProductError.NAME_ALREADY_EXISTS
                        }
                    },
                    "Product with this source product url already exists.": {
                        "summary": "Product with this source product url already exists.",
                        "value": {
                            "detail": ProductError.SOURCE_URL_ALREADY_EXISTS
                        }
                    }
                }
            }
        }
    }
}