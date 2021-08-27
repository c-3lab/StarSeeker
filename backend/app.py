from flask import Flask

from api.point import point
from api.polygon import point

app = Flask(__name__)

app.register_blueprint(point)
app.register_blueprint(polygon)

app.config.from_pyfile('appconfig.cfg')


if __name__ == '__main__':
    app.run(host=app.config['HOST'],
            port=app.config['PORT'], debug=app.config['DEBUG'])
