from flask import Flask, render_template, request
import io
import base64
from urllib.parse import urljoin
import requests
from urllib.parse import urlsplit


app = Flask(__name__, static_folder='static')
vis_count = 0
req_count = 0
dow_count = 0


@app.route('/', methods=['POST', 'GET'])
def main():
    global vis_count
    vis_count += 1
    return render_template('main.html')


@app.route('/about', methods=['GET'])
def about():
    return render_template("about.html", vis_count=vis_count, req_count=req_count, dow_count=dow_count)


@app.route('/get_image', methods=['GET'])
def get_image():
    global req_count
    req_count += 1
    def is_instagram_link(link):
        url = urlsplit(link)
        if url.netloc in ["www.instagram.com", "instagram.com"]:
            return True
        return False

    def get_instagram_photo(instagram_photo_link):
        url = urljoin(instagram_photo_link, 'media/?size=l')
        response = requests.get(url)
        if not response.ok:
            raise ValueError()
        file_like = io.BytesIO(response.content)
        return file_like

    link = request.args.get('link', '')
    if not is_instagram_link(link):
        pass
    try:
        file_object = get_instagram_photo(link)
        file_object.seek(0)
    except ValueError:
        return "value_error"
    except:
        return "unknown_error"
    
    return base64.b64encode(file_object.getvalue())


@app.route('/download_confirmation', methods=['GET'])
def download_confirmation():
    global dow_count
    dow_count += 1
    return ""