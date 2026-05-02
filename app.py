from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Database initialization
def init_db():
    conn = sqlite3.connect('agency.db')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS newsletter (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('name') or not data.get('email'):
            return jsonify({'error': 'Name and email are required'}), 400
        
        # Save to database
        conn = sqlite3.connect('agency.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO contacts (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        ''', (data['name'], data['email'], data.get('subject', ''), data.get('message', '')))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Contact form submitted successfully',
            'data': {
                'name': data['name'],
                'email': data['email'],
                'subject': data.get('subject', ''),
                'message': data.get('message', '')
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/newsletter', methods=['POST'])
def newsletter():
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
        conn = sqlite3.connect('agency.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO newsletter (email)
            VALUES (?)
        ''', (data['email'],))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Newsletter subscription successful',
            'email': data['email']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/services', methods=['GET'])
def get_services():
    try:
        conn = sqlite3.connect('agency.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM services ORDER BY created_at DESC')
        services = cursor.fetchall()
        conn.close()
        
        services_list = []
        for service in services:
            services_list.append({
                'id': service[0],
                'name': service[1],
                'description': service[2],
                'image_url': service[3],
                'created_at': service[4]
            })
        
        return jsonify({
            'success': True,
            'services': services_list
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    try:
        conn = sqlite3.connect('agency.db')
        cursor = conn.cursor()
        
        # Get contact count
        cursor.execute('SELECT COUNT(*) FROM contacts')
        contact_count = cursor.fetchone()[0]
        
        # Get newsletter count
        cursor.execute('SELECT COUNT(*) FROM newsletter')
        newsletter_count = cursor.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'success': True,
            'analytics': {
                'total_contacts': contact_count,
                'total_newsletter_subscribers': newsletter_count,
                'generated_at': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
