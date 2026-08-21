from flask import jsonify


def get_health():
    return jsonify({"status": "ok", "service": "portfolio-backend"}), 200
