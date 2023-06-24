import os
import sys
import subprocess
from random import randrange
from http.client import HTTPException
from typing import Tuple

import requests
from flask import Flask, request, Response
from datetime import datetime
app = Flask(__name__)

# Environment variables
EXEC_BASH_TOKEN = os.getenv("EXEC_BASH_TOKEN") or "password"
PORT = int(os.getenv("PORT") or 3000)
URL = os.getenv("EXTERNAL_HOSTNAME") or os.getenv("RENDER_EXTERNAL_URL") \
      or os.getenv("NF_HOSTS") or os.getenv("SPACE_HOST") or f"http://localhost:{PORT}"


def is_valid_https_key(key: str, value: str) -> bool:
    """
    Check if the given key and value represent a valid HTTPS key-value pair.

    A valid key-value pair doesn't contain localhost, 127.0.0.1, or registry in the value,
    and doesn't contain api_host in the key. Also, the key should start with "https".

    Args:
        key (str): The key to check for validity.
        value (str): The value to check for validity.
    
    Returns:
        bool: True if the key-value pair is valid, False otherwise.
    """
    if key.lower().startswith("https") and "localhost" not in value and "127.0.0.1" not in value \
            and "registry" not in value and "api_host" not in key.lower():
        return True
    return False



https_keys = [key for key, value in os.environ.items() if is_valid_https_key(key, value)]

if len(https_keys) > 0:
    https_key = https_keys[0]
    print(f"[{datetime.now()}] Find httpsKey: {https_key}")
else:
    https_key = ""
    print(f"[{datetime.now()}] No httpsKey found")

random_urls = [
  "https://hello-world-jsx.deno.dev/",
  "https://hello-world.com/",
  "https://hello-world.deno.dev/"
]


@app.route("/", methods=["GET"])
def get_landing_page():
    """
    Get the landing page of the application.

    This function fetches a random URL from the FAKE_URL environmental variable or
    randomly selects one from the random_urls list and returns it.
    """
    url = os.getenv("FAKE_URL") or random_urls[randrange(len(random_urls))]
    try:
    # rest of your code
        response = requests.get(url)
        response_text = response.text.replace("Deno Land!", "Hello World!")
        return Response(response_text, content_type="text/html")
    except HTTPException:
        return "Hello World!"


# More routes here...
# More routes here...

# robots.txt route
@app.route('/robots.txt', methods=['GET'])
def robots_txt():
    """
    Route for serving the robots.txt file.
    Returns a plain text response containing the contents of the robots.txt file.
    """
    return Response("User-agent: *\nDisallow: /", content_type="text/plain")



# 授权
def authorize(func):
    """
    Decorator to validate 'Authorization' header in request and call the wrapped function.

    Args:
        func (callable): The function to wrap.

    Returns:
        callable: The wrapped function.
    """
    def wrapper(*args, **kwargs):
        auth = request.headers.get('Authorization')
        if auth and auth == f"Bearer {EXEC_BASH_TOKEN}":
            return func(*args, **kwargs)
        else:
            return Response('Unauthorized: Access token is missing or invalid', status=401)
    return wrapper


# More routes here...
# /bash route
@app.route('/bash', methods=['POST'])
@authorize
def execute_command():
    """
    Execute a command received via an HTTP POST request.

    The command should be provided as a JSON payload with a 'cmd' key.
    The function returns the output of the command in the response.

    :return: HTTP response with command output
    """
    cmd = request.json.get('cmd')
    if not cmd:
        return Response('Bad Request: Missing or invalid cmd property', status=400)

    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True, check=False)
    if proc.returncode == 0:
        return Response(proc.stdout, status=200, content_type='text/plain')
    
    print(f"[{datetime.now()}] Error executing command: {proc.stderr}")
    return Response(proc.stderr, status=500, content_type='text/plain')


if 'win' not in sys.platform:
    try:
        subprocess.run(['bash', 'entrypoint.sh'], check=True)
    except subprocess.CalledProcessError as err:
        print(f"[{datetime.now()}] Error executing entrypoint.sh: {err}")
else:
    print(f"[{datetime.now()}] Skipping entrypoint.sh execution on Windows")

if __name__ == "__main__":
    app.run(port=PORT)
