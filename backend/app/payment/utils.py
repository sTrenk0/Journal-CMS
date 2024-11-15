import base64
import hashlib
import json
from datetime import datetime
from uuid import UUID

import ecdsa
from ecdsa import BadSignatureError

from app.settings import config

pub_key_base64 = config.monobank_pub_key


def verify_payment_hook(x_sign_base64: str, body: dict) -> bool:
    try:
        body_bytes = json.dumps(body, separators=(",", ":"), ensure_ascii=False).encode(
            "utf-8"
        )
        pub_key_bytes = base64.b64decode(pub_key_base64)
        signature_bytes = base64.b64decode(x_sign_base64)
        pub_key = ecdsa.VerifyingKey.from_pem(pub_key_bytes.decode())
        pub_key.verify(
            signature_bytes,
            body_bytes,
            sigdecode=ecdsa.util.sigdecode_der,
            hashfunc=hashlib.sha256,
        )
        return True
    except BadSignatureError:
        return False


def check_on_data_relevance(
    requested_modified_date: str, stored_modified_date: str
) -> bool:
    requested_modified_date = datetime.fromisoformat(requested_modified_date)
    stored_modified_date = datetime.fromisoformat(stored_modified_date)
    if requested_modified_date >= stored_modified_date:
        return True

    return False


def prepare_data_to_redis_storage(d: dict, convert_to_json=True):
    d = d.copy()
    for key, value in d.items():
        if isinstance(value, datetime):
            d[key] = value.isoformat()
        elif isinstance(value, dict):
            d[key] = prepare_data_to_redis_storage(value, convert_to_json=False)
        elif isinstance(value, UUID):
            d[key] = str(value)

    if convert_to_json:
        d = json.dumps(d, ensure_ascii=False, separators=(",", ":"))

    return d


def decode_data_from_redis_storage(d: str) -> dict:
    return json.loads(d)
