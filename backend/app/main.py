from .configure_app import create_configured_app


fastapi_app = create_configured_app()


@fastapi_app.get("/one")
def raise_err():
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=ProductError.NOT_FOUND
    )


# use this in case when you want run app directly without docker
# if __name__ == "__main__":
    # import uvicorn
    # from .settings import config
    # uvicorn.run("app.main:fastapi_app", host="0.0.0.0", port=config.app_port, reload=True)
