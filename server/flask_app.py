# Copyright (C) 2019 Kevin Matte - All Rights Reserved

import ast
import json
import os
import traceback

from flask import Flask, request, abort
from flask import send_from_directory
from flask.helpers import NotFound
from flask.wrappers import Response

STATUS_ERROR = 'error'
STATUS_SUCCESS = 'success'

APP_NAME = os.environ.get("name", "sample")
if __name__ == '__main__':
    ROOT_URL = f'/{APP_NAME}/'
else:
    ROOT_URL = '/'


def get_literal(value):
    """Converts strings to literal types.

    'value': The string value to convert.

    Attempts conversion with ast.literal_eval and json decoder.
    If no conversion occurs, the value will be returned.
    """

    # NOUNITTEST: Too simple

    try:
        value = ast.literal_eval(value)
    except ValueError:
        try:
            value = json.loads(value)
        except json.decoder.JSONDecodeError:
            pass
    except SyntaxError:
        pass

    return value


class RequestParameters:
    """Handles parameter retrievals that may come from a POST, PUT, or GET.

    It assumes POST and PUT's have a JSON data dictionary keyed by parameter.

    URL parameters override data parameters.
    """

    def __init__(self):
        self.request = request
        if request.method in ('POST', 'PUT'):
            self.data = request.json
        else:
            self.data = None

    def get_parameter(self, field_name, default_value=None):
        """
        Retrieves a parameter by name.
        :param field_name:
        :param default_value:
        :return:
        """
        if field_name in request.args:
            return get_literal(request.args.get(field_name, default_value))

        if self.data is not None and field_name in self.data:
            return self.data.get(field_name, default_value)

        return default_value

    def get_all_parameters(self):
        parameters = {name: get_literal(value) for name, value in request.args.items()}
        if self.data is not None:
            parameters.update(self.data)

        return parameters


def json_response(status, result):
    contents = json.dumps({'status': status, 'result': result})
    return Response(contents, mimetype="application/json")


def change_int_key_strings_to_int(old_value):
    new_value = old_value
    if isinstance(old_value, dict):
        new_value = {}
        for key, value in old_value.items():
            if '0' <= key[0] <= '9':
                try:
                    key = int(key)
                except ValueError:
                    pass
            new_value[key] = value
    elif isinstance(old_value, list):
        new_value = [change_int_key_strings_to_int(v) for v in old_value]

    return new_value


APP = Flask(
    __name__.split('.')[0],
    static_url_path=ROOT_URL + 'static',
    static_folder='../build/static',
)
application = APP


@APP.errorhandler(Exception)
def handle_unexpected_error(error):
    """Exception handling """
    print(f'{error.__class__.__name__}: {error}')
    traceback.print_tb(error.__traceback__)
    return json_response(STATUS_ERROR, [request.url, str(error)])


@APP.route(ROOT_URL + '<path:filename>')
def ui_root(filename):
    """Displays under the root UI."""
    return send_build(filename)


@APP.route(ROOT_URL)
def ui_root1():
    """Displays the root UI."""
    return send_build()


def send_build(filename="index.html"):
    if filename.startswith('api/'):
        return abort(404)
    try:
        return send_from_directory('../build', filename)
    except NotFound:
        if '.' in filename:
            raise
        return abort(404)


@APP.route(f'/{APP_NAME}/api/model', methods=['GET'])
def get_model():
    return json_response(
        'success',
        {
            'title': f'title for {APP_NAME}'
        }
    )


@APP.after_request
def apply_caching(response):
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    return response


if __name__ == '__main__':
    APP.run(debug=True, host='0.0.0.0', port=5000, threaded=False)
