from .configure_app import create_configured_app

fastapi_app = create_configured_app()


# use this in case when you want run app directly without docker
# if __name__ == "__main__":
#     import uvicorn
#     from .settings import config
#     uvicorn.run(
#         "app.main:fastapi_app",
#         host="0.0.0.0",  # noqa: S104 (this interface is only available on the closed docker network)
#         port=config.app_port,
#         reload=True,
#     )
