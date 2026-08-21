from flask import Flask
from flask_cors import CORS

from app.routes.health_routes import health_bp

FRONTEND_ORIGINS = ["http://localhost:8080", "http://127.0.0.1:8080"]


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": FRONTEND_ORIGINS}})

    app.register_blueprint(health_bp)

    return app
