from flask import Blueprint

from app.controllers.health_controller import get_health

health_bp = Blueprint("health", __name__, url_prefix="/api")

health_bp.route("/health", methods=["GET"])(get_health)
