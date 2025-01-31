from fastapi import status

from app.openapi_type import OpenAPIResponseType
from app.schemas_utils import ErrorModel

from .errors import PaymentError

PAYMENT_NOT_FOUND_RESPONSE: OpenAPIResponseType = {
    status.HTTP_404_NOT_FOUND: {
        "description": "Payment not found.",
        "model": ErrorModel,
        "content": {
            "application/json": {"example": {"detail": PaymentError.NOT_FOUND}}
        },
    }
}
