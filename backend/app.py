from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import session
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
import os
from flask import send_from_directory
from werkzeug.utils import secure_filename
from datetime import timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
frontend_origin = os.environ.get('FRONTEND_ORIGIN', 'http://localhost:5173')
CORS(app, supports_credentials=True, resources={r"/*": {"origins": frontend_origin}})
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'user'
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    name = db.Column(db.String(255),nullable=True)
    address = db.Column(db.Text,nullable=True)
    phone = db.Column(db.String(20),nullable=True)
    profile_image = db.Column(db.String(255),nullable=True) 

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    image = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2))

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(255))
    product_image = db.Column(db.Text)
    product_price = db.Column(db.Numeric(10, 2))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

admin = Admin(app, name='Admin', template_mode='bootstrap4')
admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(Product, db.session))
admin.add_view(ModelView(Cart, db.session))

@app.route("/ping")
def ping():
    return jsonify({"message": "pong"}), 200


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 409
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Registration successful'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        session.permanent = True
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/upload-profile-image', methods=['POST'])
def upload_profile_image():
    if 'user_id' not in session:
        return jsonify({'error': 'User not logged in'}), 401

    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not file.content_type.startswith('image/'):
        return jsonify({'error': 'Invalid file type'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    user = User.query.get(session['user_id'])
    user.profile_image = filename
    db.session.commit()

    return jsonify({
        'message': 'Profile image uploaded successfully',
        'profile_image': f"http://localhost:8000/uploads/{filename}"
    }), 200

@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "image": p.image,
            "price": float(p.price)
        } for p in products
    ]), 200

@app.before_request
def debug_session():
    print("Session:", session)

@app.route('/add-to-cart', methods=['POST'])
def add_to_cart():
    if 'user_id' not in session:
        return jsonify({'error': 'User not logged in'}), 401
    
    data = request.get_json()
    name = data.get('name')
    image = data.get('image')
    price = data.get('price')
    user_id = session .get('user_id')

    if not name or not image or not price:
        return jsonify({'error': 'Missing product data'}), 400
    item = Cart(product_name=name, product_image=image, product_price=price, user_id=user_id)
    db.session.add(item)
    db.session.commit()
    return jsonify({'message': 'Item added to cart'}), 201

@app.route('/user', methods=['GET'])
def get_user_info():
    print("Session at /user:", session)
    if 'user_id' not in session:
        return jsonify({'error': 'User not logged in'}), 401

    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'email': user.email,
        'name': user.name,
        'address': user.address,
        'phone': user.phone,
        'profile_image': f"http://localhost:8000/uploads/{user.profile_image}" if user.profile_image else None
    }), 200

@app.route('/user', methods=['PUT'])
def update_user():
    if 'user_id' not in session:
        return jsonify({'error': 'User not logged in'}), 401

    data = request.get_json()
    user = User.query.get(session['user_id'])

    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.name = data.get('name', user.name)
    user.address = data.get('address', user.address)
    user.phone = data.get('phone', user.phone)

    db.session.commit()
    return jsonify({'message': 'User details updated successfully'}), 200

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    response = jsonify({'message': 'Logged out'})
    response.set_cookie('session', '', expires=0)
    return response


@app.route('/cart', methods=['GET'])
def get_cart():
    if 'user_id' not in session:
        return jsonify({'error': 'user not logged in '})
    user_id = session.get('user_id')
    cart_items = Cart.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": item.id,
        "name": item.product_name,
        "image": item.product_image,
        "price": float(item.product_price)
    } for item in cart_items]), 200

@app.route('/remove-from-cart/<int:product_id>', methods=['DELETE'])
def remove_from_cart(product_id):
    item = Cart.query.get(product_id)
    if item:
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Item removed from cart'}), 200
    else:
        return jsonify({'error': 'Item not found'}), 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.environ.get('PORT', 8000))
    print(f"Backend running on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)